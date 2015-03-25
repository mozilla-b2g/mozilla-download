import taskcluster from 'taskcluster-client';
import { format } from 'url';
import buildtype from './buildtype';
import fileExtension from './file_extension';

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

  // Figure out the appropriate ns.
  let nsparts = ['buildbot'];

  let os = options.os;
  let channel = options.channel;
  let branch = options.branch;
  switch (channel) {
    case 'prerelease':
      nsparts.push('branches');
      nsparts.push(branch === 'aurora' ? 'mozilla-aurora' : 'mozilla-central');
      break;
    case 'release':
    case 'tinderbox':
    case 'try':
    default:
      // TODO(gareth): Should support release, tinderbox, and try
      return Promise.reject(new Error('Unsupported channel ' + channel));
  }

  nsparts.push(buildtype(os));
  let ns = nsparts.join('.');

  // Find task for ns.
  return index.findTask(ns)
  .then(task => {
    let taskId = task.taskId;

    // List task artifacts.
    return queue.listLatestArtifacts(taskId).then(response => {
      let artifacts = response.artifacts;
      let artifact = artifacts.find(artifact => {
        let suffix = fileExtension(os);
        return artifact.name.indexOf(suffix) !== -1;
      });

      return Promise.resolve({ taskId: taskId, artifact: artifact.name });
    });
  })
  .then(result => {
    // Url for build is
    // https://queue.taskcluster.net/v1/task/{taskId}/artifacts/{artifact}
    return format({
      protocol: 'https',
      host: 'queue.taskcluster.net',
      pathname: '/v1/task/' + result.taskId + '/artifacts/' + result.artifact
    });
  });
}
