import { ArgumentParser } from 'argparse';
import detectOS from './detectos';
import download from './download';

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

parser.addArgument(['--channel'], {
  type: 'string',
  defaultValue: 'release'
});

parser.addArgument(['--branch'], {
  type: 'string',
  defaultValue: 'latest'
});

let options = parser.parseArgs();
download(options);
