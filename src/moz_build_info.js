/**
 * @return filetype the filetype mozilla uses for build archives on a given os.
 */
export function archiveFiletype(os) {
  switch (os) {
    case 'mac64':
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
 * Options:
 *
 *   (String) debug
 *   (String) product
 *   (String) os
 *
 * @return name of build for os.
 */
export function buildname(options) {
  let result;
  switch (options.os) {
    case 'mac64':
      result = 'macosx64';
      break;
    case 'linux-i686':
      result = 'linux';
      break;
    case 'linux-x86_64':
      result = 'linux64';
      break;
    case 'win32':
      result = 'win32';
      break;
    default:
      throw new Error(`Unsupported os ${options.os}`);
  }

  switch (options.product) {
    case 'b2g-desktop':
      result += '_gecko';
      break;
    case 'firefox':
      break;
    case 'mulet':
      result += '-mulet';
      break;
    default:
      throw new Error(`Unknown product ${options.product}`);
  }

  if (options.debug) {
    result += '-debug';
  }

  return result;
}
