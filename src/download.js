let debug = require('debug')('download');
import fs from 'fs';
import { throttle } from 'lodash';
import request from 'request';
import { tempfile } from './temp';

export default function download(url, options) {
  return tempfile({ prefix: 'mozilla-download-' + options.os }).then(path => {
    let get = request.get(url);
    let stream = fs.createWriteStream(path);
    debug('Will open http connection, download to', path);

    return new Promise((accept, reject) => {
      get.on('error', reject);
      stream.on('error', reject);
      get.pipe(stream);
      get.on('data', throttle(() => process.stdout.write('.'), 1000));
      stream.on('finish', () => {
        process.stdout.write('\n');
        accept(path);
      });
    });
  });
}
