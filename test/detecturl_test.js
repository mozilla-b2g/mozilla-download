import { assert } from 'chai';
import detectURL from '../src/detecturl';

suite('detectURL', function() {
  test('x86_64 firefox aurora', function() {
    let options = {
      product: 'firefox',
      os: 'linux-x86_64',
      channel: 'prerelease',
      branch: 'aurora'
    };

    return detectURL(options).then(url => {
      assert.match(
        url,
        new RegExp(
          'https:\/\/queue.taskcluster.net\/v1\/task\/' +
          '[A-Za-z0-9-]+' +                      // task id
          '\/artifacts\/' +
          'public/build\/firefox\.*\.tar\.bz2'   // artifact name
        )
      );
    });
  });
});
