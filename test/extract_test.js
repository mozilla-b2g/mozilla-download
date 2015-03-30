import { assert } from 'chai';
import extract from '../src/extract';
import shell from '../src/shell';
import { tempdir } from '../src/temp';

suite('extract', function() {
  test('tar.bz2', function() {
    let archive = __dirname + '/fixtures/archive.tar.bz2';
    let file1, file2;
    return tempdir()
    .then(path => {
      file1 = path + '/file.txt';
      file2 = path + '/file2.txt';
      return extract({ filetype: 'tar.bz2', source: archive, dest: path });
    })
    .then(() => shell(['cat', file1, file2].join(' ')))
    .then(res => {
      assert.match(res, /lol\s*cats/);
    });
  });
});
