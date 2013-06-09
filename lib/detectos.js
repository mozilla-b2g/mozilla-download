/**
 * Determine OS type based on current process.
 *
 *    runner.detectOS(); // mac64
 *
 * @return {String} OS type to use for downloading firefox/b2g.
 */
function detectOS(product, target) {
  product = product || 'firefox';
  target = target || process;

  var arch = target.arch;
  var platform = target.platform;

  switch (platform) {
    case 'darwin':
      // firefox is always mac
      if (product === 'firefox')
        return 'mac';

      // b2g is either mac or mac64
      return (arch === 'x64') ? 'mac64' : 'mac';
    case 'linux':
      return (arch === 'x64') ? 'linux-x86_64' : 'linux-i686';
    case 'win32':
      return 'win32';
  }
}

module.exports = detectOS;
