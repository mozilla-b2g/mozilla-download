export default function buildtype(os) {
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
