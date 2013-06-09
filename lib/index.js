var mozget = require('firefox-get'),
    temp = require('temp'),
    fs = require('fs'),
    http = require('http');

function extract(url, source, target, callback) {
  if (url.split('.') === 'dmg')
    return extractDmg(url, path, target, callback);
}

/**
 * Determine OS type based on current process.
 *
 *    runner.detectOS(); // mac64
 *
 * @return {String} OS type to use for downloading firefox/b2g.
 */
function detectOS(target) {
  target = target || process;

  var arch = target.arch;
  var platform = target.platform;

  switch (platform) {
    case 'darwin':
      return (arch === 'x64') ? 'mac64' : 'mac';
    case 'linux':
      return (arch === 'x64') ? 'linux-x86_64' : 'linux-i686';
    case 'win32':
      return 'win32';
  }
}

/**
 * Downloads a mozilla product to a given path.
 *
 *    runner.download('b2g', function(path) {
 *      // do stuff with runtime
 *    });
 *
 */
function download(product, os, version, path, callback) {
  function saveToTemp(err, url) {
    if (err) return callback(err);
    temp.open(product + '-' + os, function(err, info) {
      if (err) return callback(err);
      var stream = fs.createWriteStream(info.path);
      http.get(url, function(res) {
        res.pipe(stream);
        var i = 0;
        res.on('end', function() {
          extract(url, info.path, path, callback);
        });
      });
    });
  }

  mozget[product](version, { os: os }, saveToTemp);
}

module.exports.download = download;
module.exports.detectOS = detectOS;
