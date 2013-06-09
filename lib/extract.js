var fs = require('fs'),
    fsPath = require('path'),
    ncp = require('ncp').ncp,
    temp = require('temp');
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

  if (originalSource.split('.').pop() === 'zip')
    //XXX: handle zip extractions
    return;

  if (originalSource.substr(-7) === 'tar.bz2')
    return extractTarBz2(product, source, target, callback);

}

function extractTarBz2(product, source, target, callback) {
  if (product !== 'b2g')
    throw new Error('only supports b2g right now');

  var exec = require('child_process').exec;
  var rootFile = 'b2g';

  function copy(location) {
    ncp(location, target, function(err) {
      if (err) return callback(err);
      callback(null, target);
    });
  }

  function decompress(dirPath) {
    var command = [
      'tar',
      '-vxjf',
      source,
      '-C',
      dirPath
    ];

    exec(command.join(' '), function(err, stdout, stderr) {
      if (err) return callback(err);
      copy(fsPath.join(dirPath, rootFile));
    });
  }

  temp.mkdir(product, function(err, dirPath) {
    if (err) return callback(err);
    decompress(dirPath);
  });
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
