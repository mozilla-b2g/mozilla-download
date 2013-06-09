suite('extract', function() {
  var assert = require('assert');
  var extract = require('../lib/extract');
  var fs = require('fs');

  function verifyFixture(path) {
    if (!fs.existsSync(path)) {
      throw new Error(
        'missing fixture: run |node fixtures.js| from root of project.'
      );
    }

    return path;
  }

  suite('dmg', function() {
    this.timeout('20s');
    if (process.platform !== 'darwin')
      return test('dmg can only be run on process.platform === darwin');

    var fixture =
      verifyFixture(__dirname + '/fixtures/b2g.dmg');

    var out =
      __dirname + '/extract-out/dmg';

    test('extract', function(done) {
      extract('b2g', 'b2g.dmg', fixture, out, function(err, path) {
        if (err) return done(err);
        var stat = fs.statSync(path);
        assert.ok(stat.isDirectory());
        done();
      });
    });
  });

  suite('tar.bz2', function() {
    this.timeout('20s');
    if (process.platform === 'win32')
      return test('cannot run on windows');

    var fixture =
      verifyFixture(__dirname + '/fixtures/b2g.tar.bz2');

    var out =
      __dirname + '/extract-out/tarbz2';

    test('extract', function(done) {
      extract('b2g', 'b2g.tar.bz2', fixture, out, function(err, path) {
        if (err) return done(err);
        var stat = fs.statSync(path);
        assert.ok(stat.isDirectory());
        done();
      });
    });
  });

});
