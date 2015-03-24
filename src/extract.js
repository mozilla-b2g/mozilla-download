/**
 * Extracts firefox or b2g runtime from a compressed format.
 *
 * Options:
 *
 *   (String) product
 *   (String) filetype
 *   (String) source
 *   (String) dest
 */
export default function extract(options) {
  switch (options.filetype) {
    case 'dmg':
      return extractDmg(options);
    case 'tar.bz2':
      return extractTarBz2(options);
    default:
      return Promise.reject(
        new Error('Filetype ' + options.filetype + ' not supported')
      );
  }
}

function extractDmg(options) {
  // TODO
}

function extractTarBz2(options) {
  // TODO
}
