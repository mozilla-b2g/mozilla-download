import Promise from 'promise';
import { exec } from 'mz/child_process';
import { ncp } from 'ncp';
import { tempdir } from './temp';

ncp = Promise.denodeify(ncp);

/**
 * @fileoverview Extracts firefox or b2g runtime from a compressed format.
 *
 * Options:
 *
 *   (String) filetype
 *   (String) source
 *   (String) dest
 */
export default async function extract(options) {
  let dest = options.dest;
  let path = await tempdir();
  // Extract to temporary location.
  options.dest = path;
  switch (options.filetype) {
    case 'dmg':
      await extractDmg(options);
      break;
    case 'tar.bz2':
      await extractTarball(options);
      break;
    case 'zip':
      await extractZipball(options);
      break;
    default:
      // Default to no extraction if we don't understand filetype.
      options.dest = dest;
      break;
  }

  // Copy to destination.
  await ncp(options.dest, dest);
}

function extractDmg(options) {
  // TODO(gareth)
  return Promise.reject(new Error('How to dmg?'));
}

function extractTarball(options) {
  return exec(['tar', '-xf', options.source, '-C', options.dest].join(' '));
}

function extractZipball(options) {
  return exec(['unzip', options.source, '-d', options.dest].join(' '));
}
