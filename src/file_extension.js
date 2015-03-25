export default function fileExtension(os) {
  switch (os) {
    case 'mac':
      return 'dmg';
    case 'linux-i686':
    case 'linux-x86_64':
      return 'tar.bz2';
    case 'win32':
      // TODO(gareth): What is windows suffix?
      throw new Error('Windows not supported');
    default:
      throw new Error('Unsupported os ' + os);
  }
}
