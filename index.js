'use strict';

var Transform = require('streamx').Transform;
var TextDecoder = require('util').TextDecoder;

var BOM = '\ufeff';

function removeBomStream(encoding) {
  encoding = (encoding || '').toLowerCase();
  var isUTF8 = encoding === 'utf-8' || encoding === 'utf8';

  // Needed due to https://github.com/nodejs/node/pull/42779
  if (!isUTF8) {
    return new Transform();
  }

  // Only used if encoding is UTF-8
  var decoder = new TextDecoder('utf-8', { ignoreBOM: false });

  var state = 0; // 0:Not removed, -1:In removing, 1:Already removed

  return new Transform({
    transform: onChunk,
  });

  function onChunk(data, cb) {
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

        // Node<=v12, TextDecoder#decode returns a BOM if it receives a BOM separately.
        // Ref https://github.com/nodejs/node/pull/30132
        if (chunk !== BOM) {
          state = 1;
          var buffer = Buffer.from(chunk, 'utf-8');

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
