import { assert } from 'chai';
import fs from 'fs';
import detectOS from '../src/detectos';
import main from '../src/main';
import { tempdir } from '../src/temp';

suite('main', function() {
  let cases = [
    {
      name: 'mozilla-central linux-x86_64 b2g-desktop opt',
      args: {
        product: 'b2g-desktop',
        os: 'linux-x86_64',
        branch: 'mozilla-central'
      },

      verify: function() {
        let dir = this.args.dest + '/b2g';
        assert.ok(fs.existsSync(dir), 'No b2g dir in ' + this.args.dest);
        let contents = fs.readdirSync(dir);
        assert.include(contents, 'b2g', 'No b2g bin in ' + dir);
      }
    }
  ]

  cases.forEach(testCase => {
    test(testCase.name, async function() {
      let os = detectOS();
      if (os === 'mac64' && isLinux(testCase.args.os) ||
          isLinux(os) && testCase.args.os === 'mac64') {
        return;
      }

      let dest = await tempdir();
      testCase.args.dest = dest;
      await main(testCase.args);
      testCase.verify();
    });
  });
});

function isLinux(os) {
  return os.indexOf('linux') !== -1;
}
