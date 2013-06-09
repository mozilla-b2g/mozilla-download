/**
 * Determine OS type based on current process.
 *
 *    runner.detectOS(); // mac64
 *
 * @return {String} OS type to use for downloading firefox/b2g.
 */
function detectOS(target) {
  target = target || process;

  var arch = target.arch;
  var platform = target.platform;

  switch (platform) {
    case 'darwin':
      return (arch === 'x64') ? 'mac64' : 'mac';
    case 'linux':
      return (arch === 'x64') ? 'linux-x86_64' : 'linux-i686';
    case 'win32':
      return 'win32';
  }
}

module.exports = detectOS;
