var mozget = require('firefox-get'),
    temp = require('temp'),
    fs = require('fs'),
    http = require('http'),
    debug = require('debug')('mozilla-runner:download'),
    extract = require('./extract'),
    detectOS = require('./detectos');

/**
 * Downloads a mozilla product to a given path.
 *
 *    runner.download('b2g', function(path) {
 *      // do stuff with runtime
 *    });
 *
 */
function download(product, os, version, path, callback) {
  debug('download', product, os, version);
  function saveToTemp(err, url) {
    debug('got target', url);
    if (err) return callback(err);
    temp.open(product + '-' + os, function(err, info) {
      if (err) return callback(err);
      debug('open temp stream', info.path);
      var stream = fs.createWriteStream(info.path);
      http.get(url, function(res) {
        debug('opened http connection downloading...', path);
        res.pipe(stream);
        var i = 0;
        stream.on('close', function() {
          debug('done downloading extract', url, info.path, path);
          extract(product, url, info.path, path, callback);
        });
      });
    });
  }

  mozget[product](version, { os: os }, saveToTemp);
}

module.exports.download = download;
module.exports.detectOS = detectOS;
