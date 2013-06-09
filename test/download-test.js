suite('download', function() {
  var assert = require('assert');
  var runner = require('../lib/download');
  var fs = require('fs');

  suite('mac64', function() {
    var path = __dirname + '/darwin-out/';
    if (process.platform !== 'darwin')
      return test('cannot run mac64 tests on non darwin platforms');

    test('package expansion', function(done) {
      runner.download('b2g', 'mac64', 'release', path, function(err, path) {
        var stat = fs.statSync(path);
        assert.ok(stat.isDirectory());
        done();
      });
    });
  });

  suite.only('linux-x86', function() {
    var path = __dirname + '/linux-out/';
    if (process.platform === 'win32')
      return test('cannot run on windows');

    test('package expansion', function(done) {
      runner.download('b2g', 'linux-x86_64', 'release', path, function(err, path) {
        var stat = fs.statSync(path);
        assert.ok(stat.isDirectory());
        done();
      });
    });

  });

  suite('win32', function() {
  });

});
