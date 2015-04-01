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
export default async function detectURL(options) {
  // Figure out the appropriate index namespace.
  let nsparts = [
    'buildbot',
    'branches',
    options.branch
  ];

  let os = options.os;
  nsparts.push(buildtype(os));
  let ns = nsparts.join('.');
  // Find task in the namespace.
  let index = new taskcluster.Index(TC_CLIENT_OPTS);
  let task = await index.findTask(ns);
  // List task artifacts.
  let queue = new taskcluster.Queue(TC_CLIENT_OPTS);
  let res = await queue.listLatestArtifacts(task.taskId);
  let artifacts = res.artifacts;
  let suffix = !!options.fileSuffix ?
    options.fileSuffix :
    defaultExtension(os);
  let artifact = artifacts.find(art => art.name.indexOf(suffix) !== -1);
  if (!artifact) {
    return Promise.reject(new Error('Could not find appropriate artifact'));
  }

  // Url for build is
  // https://queue.taskcluster.net/v1/task/{taskId}/artifacts/{artifact}
  return format({
    protocol: 'https',
    host: 'queue.taskcluster.net',
    pathname: '/v1/task/' + task.taskId + '/artifacts/' + artifact.name
  });
}
