var runner = require('mozilla-runner').Runner;

var instance = new Runner({
  product: 'b2g',
  version: 'release',

  // path where to download package
  path: __dirname,

  profile: __dirname + '/foobar',
  argv: ['....'] // extra args
});

// spawn subchild
instance.start();

// kill
instance.stop();
