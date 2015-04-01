export function defaultExtension(os) {
  switch (os) {
    case 'mac':
      return 'dmg';
    case 'linux-i686':
    case 'linux-x86_64':
      return 'tar.bz2';
    case 'win32':
      return 'win32.zip';
    default:
      throw new Error('Unsupported os ' + os);
  }
}

export function filetype(os) {
  switch (os) {
    case 'mac':
      return 'dmg';
    case 'linux-i686':
    case 'linux-x86_64':
      return 'tar.bz2';
    case 'win32':
      return 'zip';
    default:
      throw new Error('Unsupported os ' + os);
  }
}
