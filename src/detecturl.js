import taskcluster from 'taskcluster-client';
import { format } from 'url';
import buildtype from './buildtype';
import { defaultExtension } from './file_extension';

const TC_CLIENT_OPTS = { timeout: 30 * 1000 };

/**
 * Options:
 *
 *   (String) product
 *   (String) os
 *   (String) branch
 *   (String) fileSuffix
 */
export default function detectURL(options) {
  let index = new taskcluster.Index(TC_CLIENT_OPTS);
  let queue = new taskcluster.Queue(TC_CLIENT_OPTS);
  let os = options.os;
  let branch = options.branch;

  // Figure out the appropriate ns.
  let nsparts = [
    'buildbot',
    'branches',
    branch
  ];

  nsparts.push(buildtype(os));
  let ns = nsparts.join('.');

  // Find task for ns.
  return index.findTask(ns)
  .then(task => {
    let taskId = task.taskId;

    // List task artifacts.
    return queue.listLatestArtifacts(taskId).then(response => {
      let artifacts = response.artifacts;
      let suffix = !!options.fileSuffix ?
        options.fileSuffix :
        defaultExtension(os);

      let artifact = artifacts.find(
        artifact => artifact.name.indexOf(suffix) !== -1
      );

      if (!artifact) {
        return Promise.reject(
          new Error('Could not find artifact with suffix ' + suffix)
        );
      }

      // Url for build is
      // https://queue.taskcluster.net/v1/task/{taskId}/artifacts/{artifact}
      return format({
        protocol: 'https',
        host: 'queue.taskcluster.net',
        pathname: '/v1/task/' + taskId + '/artifacts/' + artifact.name
      });
    });
  });
}
