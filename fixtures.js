var fs = require('fs'),
    fsPath = require('path'),
    http = require('http');

var FIXTURE_ROOT = fsPath.join(__dirname, 'test', 'fixtures');
var list = [
  // source, target
  [
    'http://ftp.mozilla.org/pub/mozilla.org/b2g/nightly/latest-mozilla-central/b2g-23.0a1.multi.mac64.dmg',
    'b2g.dmg'
  ]
];

function download(pair) {
  var source = pair[0];
  var dest = fsPath.join(FIXTURE_ROOT, pair[1]);
  var stream = fs.createWriteStream(dest);

  console.log('Downloading: ', source);
  http.get(source, function(res) {
    console.log('Headers: ', source);
    res.pipe(stream);
    res.on('end', function() {
      console.log('saved %s to %s', source, dest);
    });
  });
}

// download all fixtures in parallel
list.forEach(download);
