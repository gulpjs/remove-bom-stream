'use strict';

var through = require('through2');
var TextDecoder = require('util').TextDecoder;

var BOM = Buffer.from([0xEF, 0xBB, 0xBF], 'utf-8');

function removeBomStream(encoding) {
  encoding = (encoding || '').toLowerCase();
  var isUTF8 = (encoding === 'utf-8' || encoding === 'utf8');

  if (!isUTF8) {
    return through();
  }

  // Only used if encoding is UTF-8
  var decoder = new TextDecoder('utf-8', { ignoreBOM: false });

  var state = 0; // 0:Not removed, -1:In removing, 1:Already removed

  return through(onChunk);

  function onChunk(data, _, cb) {
    if (state === 1) {
      cb(null, data);
      return;
    }

    try {
      state = -1;

      var chunk = decoder.decode(data, { stream: true });

      // The first time we have data after a decode, it should have already removed the BOM
      if (chunk !== '') {
        chunk += decoder.decode(); // end of stream mode and clear inner buffer.

        var buffer = Buffer.from(chunk, 'utf-8');

        // Node<=v11, TextDecoder#decode returns a BOM if it receives a BOM separately.
        if (BOM.compare(buffer) !== 0) {
          state = 1;
          cb(null, buffer);
          return;
        }
      }

      cb();
    } catch (err) {
      cb(err);
    }
  }
}

module.exports = removeBomStream;
