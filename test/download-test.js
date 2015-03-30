suite('download', function() {
  var assert = require('assert');
  var download = require('../lib/download');
  var fs = require('fs');

  suite('when path exists', function() {
    var path = __dirname + '/fixtures/b2g.dmg';
    test('non-strict', function(done) {
      download(path, { product: 'b2g' }, function(err, givenPath) {
        assert.equal(givenPath, path);
        done(err);
      });
    });

    test('strict', function(done) {
      var options = { product: 'b2g', strict: true };
      download(path, options, function(err, givenPath) {
        if (!err) {
          done(new Error('strict must return an error when file exists'));
          return;
        }
        done();
      });
    });
  });


  suite('mac', function() {
    var path = __dirname + '/darwin-out/';
    if (process.platform !== 'darwin')
      return test('cannot run mac64 tests on non darwin platforms');

    test('package expansion', function(done) {
      var options = { os: 'mac' };
      download(path, options, function(err, path) {
        var stat = fs.statSync(path);
        assert.ok(stat.isDirectory());
        done(err);
      });
    });
  });

  suite('linux-x86', function() {
    var path = __dirname + '/linux-out/';
    if (process.platform === 'win32')
      return test('cannot run on windows');

    test('package expansion', function(done) {
      var options = {
        os: 'linux-x86_64',
        product: 'b2g',
        channel: 'prerelease',
        branch: 'nightly'
      };

      download(path, options, function(err, path) {
        var stat = fs.statSync(path);
        assert.ok(stat.isDirectory());
        done(err);
      });
    });
  });

  suite('custom url', function() {

    function doDownload(path, url, done) {
      var options = {
        os: 'linux-x86_64',
        url: url
      };

      download(path, options, function(err, path) {
        var stat = fs.statSync(path);
        assert.ok(stat.isDirectory());
        done(err);
      });
    }

    test('package expansion', function(done) {
      var path = __dirname + '/linux-out-1/';
      var url = 'http://ftp.mozilla.org/pub/mozilla.org/firefox/releases' +
                '/21.0/linux-i686/en-US/firefox-21.0.tar.bz2';
      doDownload(path, url, done);
    });

    test('package expansion (https)', function(done) {
      var path = __dirname + '/linux-out-2/';
      var url = 'https://ftp.mozilla.org/pub/mozilla.org/firefox/releases' +
                '/21.0/linux-i686/en-US/firefox-21.0.tar.bz2';
      doDownload(path, url, done);
    });
  });
});
