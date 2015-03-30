import { ArgumentParser } from 'argparse';
import detectOS from './detectos';
import detectURL from './detecturl';
import download from './download';
import extract from './extract';
import { defaultExtension } from './file_extension';

let parser = new ArgumentParser({
  version: require('../package').version,
  description: 'Utility to download gecko builds from taskcluster index',
  addHelp: false
});

parser.addArgument(['--product'], {
  type: 'string',
  help: 'Name for gecko build (ie firefox, b2g)',
  defaultValue: 'firefox'
});

parser.addArgument(['--os'], {
  type: 'string',
  help: 'OS to download build for (ie linux-x86_64)',
  defaultValue: detectOS()
});

parser.addArgument(['--branch'], {
  type: 'string',
  defaultValue: 'mozilla-central'
});

parser.addArgument(['--file-suffix'], {
  type: 'string',
  dest: 'fileSuffix'
});

parser.addArgument(['dest'], {
  type: 'string'
});

let args = parser.parseArgs();
detectURL(args)
.then(url => download(url, args))
.then(path => {
  let extractOpts = { source: path, dest: args.dest };
  let ext = defaultExtension(args.os);
  if (!args.fileSuffix || args.fileSuffix.indexOf(ext) !== -1) {
    // They want the regular old build archive.
    extractOpts.filetype = ext;
  }

  return extract(extractOpts);
})
.catch(error => {
  console.error(error.toString());
});
