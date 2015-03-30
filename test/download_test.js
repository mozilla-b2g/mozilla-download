import { Server } from 'node-static';
import { assert } from 'chai';
import { exec } from 'child_process';
import download from '../src/download';
import { readFileSync } from 'fs';
import http from 'http';
import shell from '../src/shell';

suite('download', function() {
  let server;

  setup(function() {
    let file = new Server(__dirname + '/fixtures');
    server = http.createServer((request, response) => {
      request.addListener('end', () => file.serve(request, response)).resume();
    });

    server.listen(8080);
  });

  teardown(done => server.close(done));

  test('should download file to temp path', function() {
    return download('http://localhost:8080/index.html', { os: 'linux-x87_64' })
    .then(path => {
      let original = __dirname + '/fixtures/index.html';
      let emptyDiff = shell(['diff', original, path].join(' ')).then(diff => {
        assert.match(diff, /^\s*$/, 'downloaded file should match original');
      });

      let equalSize = Promise.all([
        shell(['du', '-h', original].join(' ')),
        shell(['du', '-h', path].join(' '))
      ])
      .then(sizes => {
        // Strip number from du output.
        sizes = sizes.map(size => size.split(/\s+/)[0]);
        assert.equal(sizes[0], sizes[1], 'downloaded file size not equal');
        assert.match(sizes[0], /^[1-9]\d*/, 'size of test download not gt 0');
      });

      return Promise.all([ emptyDiff, equalSize ]);
    })
  });
});
