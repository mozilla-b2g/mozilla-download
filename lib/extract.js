var fs = require('fs'),
    fsPath = require('path'),
    ncp = require('ncp').ncp;
/**
 * Extracts the firefox or b2g runtime from a compressed format.
 *
 * @param {String} product typically 'firefox' or 'b2g'.
 * @param {String} originalSource from the ftp site.
 * @param {String} source on the filesystem (compressed)
 * @param {String} target on the file system (destination decompressed)
 * @param {Function} callback [err, path].
 */
function extract(product, originalSource, source, target, callback) {
  if (originalSource.split('.').pop() === 'dmg')
    return extractDmg(product, source, target, callback);
}

function extractDmg(product, source, target, callback) {
  if (product !== 'b2g')
    throw new Error('only supports b2g right now');

  var dmg = require('dmg');
  var rootFile = 'B2G.app';

  // mount the dmg
  dmg.mount(source, function(err, path) {
    if (err) return callback(err);
    ncp(
      fsPath.join(path, rootFile),
      target,
      function(err) {
        if (err) return callback(err);
        callback(null, target);
      }
    );
  });
}

module.exports = extract;
