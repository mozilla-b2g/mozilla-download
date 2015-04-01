import { ArgumentParser } from 'argparse';
import detectOS from './detectos';
import detectURL from './detecturl';
import download from './download';
import extract from './extract';
import { filetype } from './file_extension';

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

export default async function main(args=parser.parseArgs()) {
  try {
    let url = await detectURL(args);
    let path = await download(url, args);
    let extractOpts = { source: path, dest: args.dest };
    let extension = filetype(args.os);
    if (args.fileSuffix) {
      let parts = args.fileSuffix.split('.');
      extractOpts.filetype = parts[parts.length - 1];
    } else {
      // They want the regular old build archive.
      extractOpts.filetype = extension;
    }

    await extract(extractOpts);
  } catch (error) {
    console.error(error.toString());
  }
}
