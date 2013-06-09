var fs = require('fs'),
    fsPath = require('path'),
    ncp = require('ncp').ncp,
    tmp = require('tmp'),
    debug = require('debug')('mozilla-runner:extract');
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
  debug('request', product, originalSource);

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

  debug('tar.bz2', source, target);

  var exec = require('child_process').exec;
  var rootFile = 'b2g';

  function copy(location) {
    debug('copy contents of decompression');
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

    debug('decompress bz2', command);
    exec(command.join(' '), function(err, stdout, stderr) {
      if (err) return callback(err);
      copy(fsPath.join(dirPath, rootFile));
    });
  }

  tmp.dir({ prefix: product, unsafeCleanup: true }, function(err, dirPath) {
    if (err) return callback(err);
    debug('bz2 temp dir created', dirPath);
    decompress(dirPath);
  });
}

function extractDmg(product, source, target, callback) {
  if (product !== 'b2g')
    throw new Error('only supports b2g right now');

  debug('dmg', source, target);
  var dmg = require('dmg');
  var rootFile = 'B2G.app';

  // mount the dmg
  dmg.mount(source, function(err, path) {
    if (err) return callback(err);
    debug('dmg mounted', source, path);
    ncp(
      fsPath.join(path, rootFile),
      target,
      function(err) {
        debug('dmg copying directory done');
        if (err) return callback(err);
        callback(null, target);
      }
    );
  });
}

module.exports = extract;
