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

});
