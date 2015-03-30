import { assert } from 'chai';
import detectURL from '../src/detecturl';

suite('detectURL', function() {
  test('x86_64 firefox aurora', function() {
    let options = {
      product: 'firefox',
      os: 'linux-x86_64',
      branch: 'mozilla-aurora'
    };

    return detectURL(options).then(url => {
      assert.match(
        url,
        new RegExp(
          'https:\/\/queue.taskcluster.net\/v1\/task\/' +
          '[A-Za-z0-9-_]+' +                     // task id
          '\/artifacts\/' +
          'public/build\/firefox\.*\.tar\.bz2'   // artifact name
        )
      );
    });
  });

  test('fileSuffix specified', function() {
    let options = {
      product: 'firefox',
      os: 'mac',
      branch: 'mozilla-central',
      fileSuffix: 'crashreporter-symbols.zip'
    }

    return detectURL(options).then(url => {
      assert.match(
        url,
        new RegExp(
          'https:\/\/queue.taskcluster.net\/v1\/task\/' +
          '[A-Za-z0-9-_]+' +                     // task id
          '\/artifacts\/' +
          'public/build\/firefox\.*\.crashreporter-symbols\.zip'
        )
      );
    });
  });

  test('bogus fileSuffix', function() {
    let options = {
      product: 'firefox',
      os: 'linux-x86_64',
      branch: 'mozilla-inbound',
      fileSuffix: 'totalrando'
    };

    return detectURL(options).catch(error => {
      assert.include(error.message, 'Could not find artifact');
    });
  });
});
