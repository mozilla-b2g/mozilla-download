var moz = require('../../index'),
    binaryPath = __dirname + '/firefox/',
    spawn = require('child_process').spawn,
    fs = require('fs');

var os = moz.detectOS('firefox');

function download(callback) {
  if (fs.existsSync(binaryPath)) {
    return process.nextTick(callback);
  }

  console.log('download start', os);

  moz.download(
    'firefox',
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
  var bin = 'firefox-bin';

  if (os.indexOf('mac') === 0)
    bin = 'Contents/MacOS/firefox';

  console.log('launching binary', bin);

  var process = spawn(binaryPath + bin);

  setTimeout(function() {
    process.kill();
  }, 5000);

}

download(launch);

