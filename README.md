# Mozilla Download

Downloads mozilla product binaries. Version detection / support using [firefox-get](https://github.com/jsantell/node-firefox-get).

## Usage

``` js
var moz = require('mozilla-download');

// detect which platform this computer uses
moz.detectOS('firefox'); // platform for firefox
moz.detectOS('b2g'); // platform for b2g

// download firefox nightly
moz.download(
  'firefox', // product can be either firefox or b2g
  moz.detectOS('firefox'), // helper to determine OS based on process see firefox-get for options
  'nightly', // channel
  __dirname + '/firefox', // save target
  functon(err, path) {
    // path is the same as save targe
  }
);

// download b2g desktop nightly
moz.download(
  'b2g', // product can be either firefox or b2g
  moz.detectOS('b2g'), // helper to determine OS based on process see firefox-get for options
  'nightly', // channel
  __dirname + '/b2g', // save target
  functon(err, path) {
    // path is the same as save targe
  }
);

```


## License

The MIT License (MIT)

Copyright (c) 2013 Sahaja James Lal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
