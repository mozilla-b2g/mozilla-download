import { assert } from 'chai';
import detectURL from '../src/detecturl';

suite('detectURL', function() {
  test('x86_64 firefox aurora', async function() {
    let options = {
      product: 'firefox',
      os: 'linux-x86_64',
      branch: 'mozilla-aurora'
    };

    let url = await detectURL(options);
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

  test('fileSuffix specified', async function() {
    let options = {
      product: 'firefox',
      os: 'mac',
      branch: 'mozilla-central',
      fileSuffix: 'crashreporter-symbols.zip'
    };

    let url = await detectURL(options);
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

  test('bogus fileSuffix', async function() {
    let options = {
      product: 'firefox',
      os: 'linux-x86_64',
      branch: 'mozilla-inbound',
      fileSuffix: 'totalrando'
    };

    try {
      await detectURL(options);
    } catch (error) {
      assert.equal(error.message, 'Could not find appropriate artifact');
    }
  });
});
