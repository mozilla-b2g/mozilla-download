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

  test('should download file to temp path', async function() {
    let path = await download('http://localhost:8080/index.html', {
      os: 'linux-x87_64'
    });

    let original = __dirname + '/fixtures/index.html';
    let diff = await shell(['diff', original, path].join(' '));
    assert.match(diff, /^\s*$/, 'downloaded file should match original');

    let size = await fileSize(path);
    assert.match(size, /^[1-9]\d*/, 'size of test download not gt 0');
  });
});

async function fileSize(path) {
  let res = await shell(['du', '-h', path].join(' '));
  return res.split(/\s+/)[0];
}
