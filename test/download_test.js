import { assert } from 'chai';
import download from '../src/download';
import { readFileSync } from 'fs';
import http from 'http';
import { Server } from 'node-static';

suite('download', function() {
  let server;

  setup(function() {
    console.log(__dirname + '/fixtures');
    let file = new Server(__dirname + '/fixtures');
    server = http.createServer((request, response) => {
      request.addListener('end', () => file.serve(request, response)).resume();
    });

    server.listen(8080);
  });

  teardown(done => server.close(done));

  test('should download file to temp path', function() {
    return download('http://localhost:8080/index.html', { os: 'linux-x86_64' })
    .then(path => {
      let result = readFileSync(path, { encoding: 'utf8' });
      assert.include(result, 'pwn3d');
    });
  });
});
