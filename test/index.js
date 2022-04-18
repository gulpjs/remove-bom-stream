'use strict';

var fs = require('fs');
var path = require('path');
var pipeline = require('stream').pipeline;

var expect = require('expect');
var concat = require('concat-stream');
var chunker = require('stream-chunker');
var Readable = require('streamx').Readable;

var removeBomStream = require('../');

describe('removeBomStream', function () {
  it('ignores UTF8 buffer without a BOM', function (done) {
    var filepath = path.join(__dirname, './fixtures/test.txt');

    var expected = fs.readFileSync(filepath);

    function assert(data) {
      expect(data).toEqual(expected);
    }

    pipeline(
      [fs.createReadStream(filepath), removeBomStream('utf-8'), concat(assert)],
      done
    );
  });

  it('ignores UTF8 buffer without a BOM even if first chunk is shorter than 7 chars but second and subsequent are larger', function (done) {
    var filepath = path.join(__dirname, './fixtures/test.txt');
    var fileContent = fs.readFileSync(filepath);

    var expected = fileContent;

    function assert(data) {
      expect(data).toEqual(expected);
    }

    var reader = new Readable();
    pipeline([
      reader,
      removeBomStream('utf-8'),
      concat(assert)
    ], done);

    reader.push(fileContent.slice(0, 5));
    reader.push(fileContent.slice(5));
    reader.push(null);
  });

  it('removes the BOM from a UTF8 buffer', function (done) {
    var filepath = path.join(__dirname, './fixtures/bom-utf8.txt');

    var expected = fs.readFileSync(filepath).slice(3);

    function assert(data) {
      expect(data).toEqual(expected);
    }

    pipeline(
      [fs.createReadStream(filepath), removeBomStream('UTF-8'), concat(assert)],
      done
    );
  });

  it('handles small chunks', function (done) {
    var filepath = path.join(__dirname, './fixtures/bom-utf8.txt');

    var expected = fs.readFileSync(filepath).slice(3);

    function assert(data) {
      expect(data).toEqual(expected);
    }

    pipeline(
      [
        fs.createReadStream(filepath),
        chunker(1),
        removeBomStream('UTF8'),
        concat(assert),
      ],
      done
    );
  });

  it('removes the BOM from a UTF8 buffer that is shorter than 7 chars', function (done) {
    var filepath = path.join(__dirname, './fixtures/bom-utf8-short.txt');

    var expected = fs.readFileSync(filepath).slice(3);

    function assert(data) {
      expect(data.length < 7).toEqual(true);
      expect(expected.length < 7).toEqual(true);
      expect(data).toEqual(expected);
    }

    pipeline(
      [fs.createReadStream(filepath), removeBomStream('UTF-8'), concat(assert)],
      done
    );
  });

  it('remove the BOM from a UTF8 buffer even if first chunk is shorter than 7 chars but second and subsequent are larger', function (done) {
    var filepath = path.join(__dirname, './fixtures/bom-utf8.txt');
    var fileContent = fs.readFileSync(filepath);

    // UTF8 BOM takes up 3 characters in the buffer
    var expected = fileContent.slice(3);

    function assert(data) {
      expect(data).toEqual(expected);
    }

    var reader = new Readable();
    pipeline([
      reader,
      removeBomStream('utf-8'),
      concat(assert)
    ], done);

    reader.push(fileContent.slice(0, 5));
    reader.push(fileContent.slice(5));
    reader.push(null);
  });

  it('does not remove the BOM from a UTF16BE buffer', function (done) {
    var filepath = path.join(__dirname, './fixtures/bom-utf16be.txt');

    var expected = fs.readFileSync(filepath);

    function assert(data) {
      expect(data).toEqual(expected);
    }

    pipeline(
      [
        fs.createReadStream(filepath),
        removeBomStream('utf-16be'),
        concat(assert),
      ],
      done
    );
  });

  it('does not remove the BOM from a UTF16BE buffer that is shorter than 7 chars', function (done) {
    var filepath = path.join(__dirname, './fixtures/bom-utf16be-short.txt');

    var expected = fs.readFileSync(filepath);

    function assert(data) {
      expect(data).toEqual(expected);
    }

    pipeline(
      [
        fs.createReadStream(filepath),
        removeBomStream('utf-16be'),
        concat(assert),
      ],
      done
    );
  });

  it('does not remove the BOM from a UTF16LE buffer', function (done) {
    var filepath = path.join(__dirname, './fixtures/bom-utf16le.txt');

    var expected = fs.readFileSync(filepath);

    function assert(data) {
      expect(data).toEqual(expected);
    }

    pipeline(
      [
        fs.createReadStream(filepath),
        removeBomStream('utf-16le'),
        concat(assert),
      ],
      done
    );
  });
});
