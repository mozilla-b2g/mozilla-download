suite('download', function() {
  var assert = require('assert');
  var runner = require('../lib/index');

  suite('mac64', function() {
    var path = __dirname + '/darwin-out/';
    if (process.platform !== 'darwin')
      return test('cannot run mac64 tests on non darwin platforms');

    test('package expansion', function(done) {
      runner.download('b2g', 'mac64', 'release', path, function(err, path) {
        done();
      });
    });
  });

  suite('linux-x86', function() {
  });

  suite('win32', function() {
  });

});
