suite('download', function() {
  var assert = require('assert');
  var runner = require('../index');
  var fs = require('fs');

  suite('when path exists', function() {
    var path = __dirname + '/fixtures/b2g.dmg';
    test('non-strict', function(done) {
      runner.download('b2g', path, function(err, givenPath) {
        assert.equal(givenPath, path);
        done(err);
      });
    });

    test('strict', function(done) {
      runner.download('b2g', path, { strict: true }, function(err, givenPath) {
        if (!err) {
          done(new Error('strict must return an error when file exists'));
          return;
        }
        done();
      });
    });
  });


  suite('mac64', function() {
    var path = __dirname + '/darwin-out/';
    if (process.platform !== 'darwin')
      return test('cannot run mac64 tests on non darwin platforms');

    test('package expansion', function(done) {
      var options = { os: 'mac64', version: 'release' };
      runner.download('b2g', path, options, function(err, path) {
        var stat = fs.statSync(path);
        assert.ok(stat.isDirectory());
        done();
      });
    });
  });

  suite('linux-x86', function() {
    var path = __dirname + '/linux-out/';
    if (process.platform === 'win32')
      return test('cannot run on windows');

    test('package expansion', function(done) {
      var options = { os: 'linux-x86_64', version: 'release' };
      runner.download('b2g', path, options, function(err, path) {
        var stat = fs.statSync(path);
        assert.ok(stat.isDirectory());
        done();
      });
    });

  });

});
