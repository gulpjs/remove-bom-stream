'use strict';

var fs = require('fs');
var path = require('path');

var expect = require('expect');
var miss = require('mississippi');
var isEqual = require('buffer-equal');
var chunker = require('stream-chunker');

var removeBomStream = require('../');

var pipe = miss.pipe;
var concat = miss.concat;

describe('removeBomStream', function() {

  it('ignores UTF8 buffer without a BOM', function(done) {
    var filepath = path.join(__dirname, './fixtures/test.txt');

    var expected = fs.readFileSync(filepath);

    function assert(data) {
      expect(isEqual(data, expected)).toEqual(true);
    }

    pipe([
      fs.createReadStream(filepath),
      removeBomStream(),
      concat(assert),
    ], done);
  });

  it('removes the BOM from a UTF8 buffer', function(done) {
    var filepath = path.join(__dirname, './fixtures/bom-utf8.txt');

    var expected = fs.readFileSync(filepath).slice(3);

    function assert(data) {
      expect(isEqual(data, expected)).toEqual(true);
    }

    pipe([
      fs.createReadStream(filepath),
      removeBomStream(),
      concat(assert),
    ], done);
  });

  it('handles small chunks', function(done) {
    var filepath = path.join(__dirname, './fixtures/bom-utf8.txt');

    var expected = fs.readFileSync(filepath).slice(3);

    function assert(data) {
      expect(isEqual(data, expected)).toEqual(true);
    }

    pipe([
      fs.createReadStream(filepath),
      chunker(1),
      removeBomStream(),
      concat(assert),
    ], done);
  });

  it('removes the BOM from a UTF8 buffer that is shorter than 7 chars', function(done) {
    var filepath = path.join(__dirname, './fixtures/bom-utf8-short.txt');

    var expected = fs.readFileSync(filepath).slice(3);

    function assert(data) {
      expect(data.length < 7).toEqual(true);
      expect(expected.length < 7).toEqual(true);
      expect(isEqual(data, expected)).toEqual(true);
    }

    pipe([
      fs.createReadStream(filepath),
      removeBomStream(),
      concat(assert),
    ], done);
  });

  it('does not remove the BOM from a UTF16BE buffer', function(done) {
    var filepath = path.join(__dirname, './fixtures/bom-utf16be.txt');

    var expected = fs.readFileSync(filepath);

    function assert(data) {
      expect(isEqual(data, expected)).toEqual(true);
    }

    pipe([
      fs.createReadStream(filepath),
      removeBomStream(),
      concat(assert),
    ], done);
  });

  it('does not remove the BOM from a UTF16BE buffer that is shorter than 7 chars', function(done) {
    var filepath = path.join(__dirname, './fixtures/bom-utf16be-short.txt');

    var expected = fs.readFileSync(filepath);

    function assert(data) {
      expect(isEqual(data, expected)).toEqual(true);
    }

    pipe([
      fs.createReadStream(filepath),
      removeBomStream(),
      concat(assert),
    ], done);
  });

  it('does not remove the BOM from a UTF16LE buffer', function(done) {
    var filepath = path.join(__dirname, './fixtures/bom-utf16le.txt');

    var expected = fs.readFileSync(filepath);

    function assert(data) {
      expect(isEqual(data, expected)).toEqual(true);
    }

    pipe([
      fs.createReadStream(filepath),
      removeBomStream(),
      concat(assert),
    ], done);
  });
});
