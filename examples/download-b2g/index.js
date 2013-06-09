var moz = require('../../index'),
    binaryPath = __dirname + '/b2g/',
    spawn = require('child_process').spawn,
    fs = require('fs');

var os = moz.detectOS('b2g');

function download(callback) {
  if (fs.existsSync(binaryPath)) {
    return process.nextTick(callback);
  }

  console.log('download start', os);

  moz.download(
    'b2g',
    os,
    'nightly',
    binaryPath,
    function(err, path) {
      if (err) throw err;
      callback();
    }
  );
}

function launch() {
  var bin = 'b2g-bin';

  if (os.indexOf('mac') === 0)
    bin = 'Contents/MacOS/b2g-bin';

  console.log('launching binary', bin);

  var process = spawn(binaryPath + bin);

  setTimeout(function() {
    process.kill();
  }, 5000);

}

download(launch);
