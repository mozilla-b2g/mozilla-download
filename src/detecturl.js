import { format } from 'url';
import taskcluster from 'taskcluster-client';

const TC_CLIENT_OPTS = { timeout: 30 * 1000 };

/**
 * Options:
 *
 *   (String) product
 *   (String) os
 *   (String) channel
 *   (String) branch
 */
export default function detectURL(options) {
  let index = new taskcluster.Index(TC_CLIENT_OPTS);
  let queue = new taskcluster.Queue(TC_CLIENT_OPTS);

  let channel = options.channel;
  let branch = options.branch;
  let nsparts = ['buildbot'];
  switch (channel) {
    case 'prerelease':
      nsparts.push('branches');
      switch (branch) {
        case 'mozilla-central':
        case 'nightly':
          nsparts.push('mozilla-central');
          break;
        case 'aurora':
          nsparts.push('mozilla-aurora');
          break;
      }

      break;
    case 'release':
    case 'tinderbox':
    case 'try':
    default:
      // TODO(gareth): Should support release, tinderbox, and try
      return Promise.reject(new Error('Unsupported channel ' + channel));
  }

  let os = options.os;
  switch (os) {
    case 'mac':
      nsparts.push('macosx64-debug');
      break;
    case 'linux-i686':
      nsparts.push('linux-debug');
      break;
    case 'linux-x86_64':
      nsparts.push('linux64-debug');
      break;
    case 'win32':
      nsparts.push('win32');
      break;
  }

  let ns = nsparts.join('.');

  return index.findTask(ns).then(task => {
    let id = task.taskId;
    return queue.listLatestArtifacts(id).then(response => {
      let artifacts = response.artifacts;
      let artifact = artifacts.find(artifact => {
        let suffix;
        switch (os) {
          case 'mac':
            suffix = 'dmg';
            break;
          case 'linux-i686':
          case 'linux-x86_64':
            suffix = 'tar.bz2';
            break;
          case 'win32':
            // TODO(gareth): What is suffix?
            return Promise.reject(new Error('Windows not supported'));
        }

        return artifact.name.indexOf(suffix) !== -1;
      });

      return format({
        protocol: 'https',
        host: 'queue.taskcluster.net',
        pathname: '/v1/task/' + id + '/artifacts/' + artifact.name
      });
    });
  });
}
