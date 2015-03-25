import { assert } from 'chai';
import debounce from '../src/debounce';

suite('debounce', function() {
  test('should wait to call', function() {
    let i = 0;
    let f = debounce(() => i++, 100);
    let interval = setInterval(f, 50);

    return new Promise(accept => {
      setTimeout(() => {
        assert.equal(i, 0);
        clearInterval(interval);
        setTimeout(() => {
          assert.equal(i, 1)
          accept();
        }, 150);
      }, 1000);
    });
  });
});
