import debounce from './debounce';
import debug from 'debug';
import http from 'http';
import fs from 'fs';
import tmp from 'tmp';

export default function download(url, options) {
  return Promise.all([
    tmpFile({ prefix: 'mozilla-download-' + options.os }),
    httpGet(url)
  ])
  .then(result => {
    let [tmpPath, response] = result;

    let stream = fs.createWriteStream(tmpPath);
    response.pipe(stream);
    debug('Opened http connection downloading...', tmpPath);
    response.on('data', debounce(() => process.stdout.write('.'), 1000));

    return new Promise((accept, reject) => {
      stream.on('error', reject);
      stream.on('finish', () => {
        process.stdout.write('\n');
        accept(tmpPath);
      });
    });
  });
}

function tmpFile(options) {
  return new Promise((accept, reject) => {
    tmp.file(options, (err, path) => {
      if (err) reject(err);
      accept(path);
    });
  });
}

function httpGet(url) {
  return new Promise(accept => http.get(url, accept));
}
