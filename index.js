'use strict';

var through = require('through2');
var TextDecoder = require('util').TextDecoder;

function removeBomStream(encoding) {
  encoding = (encoding || '').toLowerCase();
  var isUTF8 = (encoding === 'utf-8' || encoding === 'utf8');

  // Only used if encoding is UTF-8
  var decoder = new TextDecoder('utf-8', { ignoreBOM: false });

  var state = 0; // 0:Not removed, -1:In removing, 1:Already removed

  return through(onChunk);

  function onChunk(data, _, cb) {
    if (state === 1 || !isUTF8) {
      cb(null, data);
    } else {
      try {
        state = -1;

        var chunk = decoder.decode(data, { stream: true });

        // The first time we have data after a decode, it should have already removed the BOM
        if (chunk !== '') {
          state = 1
        }

        cb(null, Buffer.from(chunk, encoding));
      } catch (err) {
        cb(err);
      }
    }
  }
}

module.exports = removeBomStream;
