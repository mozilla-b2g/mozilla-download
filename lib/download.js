var mozget = require('mozilla-get-url'),
    tmp = require('tmp'),
    fs = require('fs'),
    http = require('http'),
    debug = require('debug')('mozilla-runner:download'),
    opts = require('./options'),
    fetch = require('./fetch');

var DEFAULT_VERSION = 'nightly';

/**
 * Downloads a mozilla product to a given path.
 *
 *    runner.download('firefox', path, function(err) {
 *      // do amazing things!
 *    });
 *
 * Options (these are passed to mozilla-get-url):
 *    - product: like firefox / b2g
 *    - os: to download for (see firefox-get)
 *    - version: or channel (like 18 or 'nightly')
 *    - strict: send an error if given path exists.
 *
 * @param {String} path to download file to.
 * @param {Object} [options] optional set of configuration options.
 * @param {Function} callback [err, path];
 */
function download(path, options, callback) {
  mozget(options, function(err, url) {
    if (err) return callback(err);
    fetch(options.product, url, path, callback);
  });
}

function checkDownload(path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  options = opts(options || {});

  var strictErrors = options.strict;

  // don't clobber an existing path
  fs.exists(path, function(itDoes) {

    // bail immediately if path is filled
    if (itDoes) {
      // unless strict is on we simply return the given path assuming it works.
      if (!strictErrors) return callback(null, path);

      // in other cases the caller might want an error.
      return callback(
        new Error('cannot clobber existing path with download: "' + path + '"')
      );
    }

    // if path does not exist continue with normal download process.
    download(path, options, callback);
  });
}

module.exports = checkDownload;
