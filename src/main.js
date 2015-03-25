import { ArgumentParser } from 'argparse';
import detectOS from './detectos';
import detectURL from './detecturl';
import download from './download';
import extract from './extract';

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

let args = parser.parseArgs();
detectURL(args)
.then(url => download(url, args))
.then(tmpPath => extract(args.product, tmpPath, args[0] /* dest */));
