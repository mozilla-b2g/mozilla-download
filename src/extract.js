import Promise from 'promise';
import { ncp } from 'ncp';
import shell from './shell';
import { tempdir } from './temp';

let cpr = Promise.denodeify(ncp);

/**
 * @fileoverview Extracts firefox or b2g runtime from a compressed format.
 *
 * Options:
 *
 *   (String) filetype
 *   (String) source
 *   (String) dest
 */
export default function extract(options) {
  let dest = options.dest;
  return tempdir()
  .then(path => {
    // Extract to temporary location.
    options.dest = path;
    switch (options.filetype) {
      case 'dmg':
        return extractDmg(options);
      case 'tar.bz2':
        return extractTarBz2(options);
      default:
        // Default to no extraction if we don't understand filetype.
        options.dest = dest;
        return Promise.resolve();
    }
  })
  .then(() => {
    // Copy to destination.
    return cpr(options.dest, dest);
  });
}

function extractDmg(options) {
  // TODO(gareth)
  return Promise.reject(new Error('How to dmg?'));
}

function extractTarBz2(options) {
  return shell(['tar', '-xf', options.source, '-C', options.dest].join(' '));
}
