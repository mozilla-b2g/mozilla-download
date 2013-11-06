var tmp = require('tmp'),
    fs = require('fs'),
    http = require('http'),
    debug = require('debug')('mozilla-runner:download'),
    opts = require('./options'),
    extract = require('./extract');

/**
 * Downloads a mozilla product to a given path.
 *
 *    runner.download('firefox', url, dest, function(err) {
 *      // do amazing things!
 *    });
 *
 * @param {String} product type of download.
 * @param {String} path to download file to.
 * @param {Object} [options] optional set of configuration options.
 * @param {Function} callback [err, path];
 */
function fetch(product, url, destination, callback) {
  tmp.file({ prefix: 'mozilla-download-' + product }, function(err, tmpPath) {
    if (err) return callback(err);
    debug('open temp stream', tmpPath);
    var stream = fs.createWriteStream(tmpPath);
    http.get(url, function(res) {
      debug('opened http connection downloading...', url);
      res.pipe(stream);
      var i = 0;
      stream.on('close', function() {
        debug('done downloading extract', url, tmpPath, destination);
        extract(product, url, tmpPath, destination, callback);
      });
    });
  });
}

module.exports = fetch;
