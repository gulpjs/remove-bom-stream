"use strict";

var { Duplex } = require("stream");

function removeBomStream(encoding) {
  return Duplex.fromWeb(new TextDecoderStream(encoding, { ignoreBOM: false }));
}

module.exports = removeBomStream;
