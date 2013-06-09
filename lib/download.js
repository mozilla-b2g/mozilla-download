var mozget = require('firefox-get'),
    tmp = require('tmp'),
    fs = require('fs'),
    http = require('http'),
    debug = require('debug')('mozilla-runner:download'),
    extract = require('./extract'),
    detectOS = require('./detectos');

/**
 * Downloads a mozilla product to a given path.
 *
 *    runner.download(
 *      'b2g',
 *      runner.detectOS(),
 *      'release',
 *      path,
 *      function() {
 *        // do stuff with runtime
 *      }
 *    );
 *
 */
function download(product, os, version, path, callback) {
  debug('download', product, os, version);
  function saveToTemp(err, url) {
    debug('got target', url);
    if (err) return callback(err);
    tmp.file({ prefix: product + '-' + os }, function(err, tmpPath) {
      if (err) return callback(err);
      debug('open temp stream', tmpPath);
      var stream = fs.createWriteStream(tmpPath);
      http.get(url, function(res) {
        debug('opened http connection downloading...', path);
        res.pipe(stream);
        var i = 0;
        stream.on('close', function() {
          debug('done downloading extract', url, tmpPath, path);
          extract(product, url, tmpPath, path, callback);
        });
      });
    });
  }

  mozget[product](version, { os: os }, saveToTemp);
}

module.exports = download;
