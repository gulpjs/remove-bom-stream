'use strict';

var through = require('through2');
var isUTF8 = require('is-utf8');
var TextDecoder = require('util').TextDecoder;

var removeBom = new TextDecoder('utf-8', { ignoreBOM: false });

function removeBomStream() {
  var state = 0; // 0:Not removed, -1:In removing, 1:Already removed
  var buffer = Buffer.alloc(0);

  return through(onChunk, onFlush);

  function removeAndCleanup(data) {
    state = 1; // Already removed

    buffer = null;

    if (isUTF8(data)) {
      return removeBom.decode(data);
    }
    return data;
  }

  function onChunk(data, enc, cb) {
    if (state === 1) {
      return cb(null, data);
    }

    if (state === 0 /* Not removed */ && data.length >= 7) {
      return cb(null, removeAndCleanup(data));
    }

    state = -1; // In removing

    var bufferLength = buffer.length;
    var chunkLength = data.length;
    var totalLength = bufferLength + chunkLength;

    buffer = Buffer.concat([buffer, data], totalLength);

    if (totalLength >= 7) {
      return cb(null, removeAndCleanup(buffer));
    }
    cb();
  }

  function onFlush(cb) {
    if (state === 2 /* Already removed */ || !buffer) {
      return cb();
    }

    cb(null, removeAndCleanup(buffer));
  }
}

module.exports = removeBomStream;
