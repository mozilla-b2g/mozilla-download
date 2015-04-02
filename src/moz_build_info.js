/**
 * @return filetype the filetype mozilla uses for build archives on a given os.
 */
export function archiveFiletype(os) {
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

/**
 * @return suffix end of filename (including filetype) for build archive.
 */
export function archiveFileSuffix(os) {
  return os + '.' + archiveFiletype(os);
}

/**
 * @return name of build for os.
 */
export function buildname(os) {
  switch (os) {
    case 'mac':
      return 'macosx64-debug';
    case 'linux-i686':
      return 'linux-debug';
    case 'linux-x86_64':
      return 'linux64-debug';
    case 'win32':
      return 'win32-debug';
    default:
      throw new Error('Unsupported os ' + os);
  }
}
