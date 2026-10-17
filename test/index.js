"use strict";

var fs = require("node:fs");
var path = require("node:path");
var pipeline = require("node:stream").pipeline;

var assert = require("node:assert");
var { describe, it } = require("node:test");
var concat = require("concat-stream");
var chunker = require("stream-chunker");
var Readable = require("streamx").Readable;

var removeBomStream = require("../");

describe("removeBomStream", function () {
  it("ignores UTF8 buffer without a BOM", function (t, done) {
    var filepath = path.join(__dirname, "./fixtures/test.txt");

    var expected = fs.readFileSync(filepath);

    function assertion(data) {
      assert.deepStrictEqual(data, expected);
    }

    pipeline(
      fs.createReadStream(filepath),
      removeBomStream("utf-8"),
      concat(assertion),
      done,
    );
  });

  it("ignores UTF8 buffer without a BOM even if first chunk is shorter than 7 chars but second and subsequent are larger", function (t, done) {
    var filepath = path.join(__dirname, "./fixtures/test.txt");
    var fileContent = fs.readFileSync(filepath);

    var expected = fileContent;

    function assertion(data) {
      assert.deepStrictEqual(data, expected);
    }

    var reader = new Readable();
    pipeline([reader, removeBomStream("utf-8"), concat(assertion)], done);

    reader.push(fileContent.subarray(0, 5));
    reader.push(fileContent.subarray(5));
    reader.push(null);
  });

  it("removes the BOM from a UTF8 buffer", function (t, done) {
    var filepath = path.join(__dirname, "./fixtures/bom-utf8.txt");

    var expected = fs.readFileSync(filepath).subarray(3);

    function assertion(data) {
      assert.deepStrictEqual(data, expected);
    }

    pipeline(
      fs.createReadStream(filepath),
      removeBomStream("UTF-8"),
      concat(assertion),
      done,
    );
  });

  it("handles small chunks", function (t, done) {
    var filepath = path.join(__dirname, "./fixtures/bom-utf8.txt");

    var expected = fs.readFileSync(filepath).subarray(3);

    function assertion(data) {
      assert.deepStrictEqual(data, expected);
    }
    pipeline(
      fs.createReadStream(filepath),
      chunker(1),
      removeBomStream("UTF8"),
      concat(assertion),
      done,
    );
  });

  it("removes the BOM from a UTF8 buffer that is shorter than 7 chars", function (t, done) {
    var filepath = path.join(__dirname, "./fixtures/bom-utf8-short.txt");

    var expected = fs.readFileSync(filepath).subarray(3);

    function assertion(data) {
      assert.ok(data.length < 7);
      assert.ok(expected.length < 7);
      assert.deepStrictEqual(data, expected);
    }

    pipeline(
      fs.createReadStream(filepath),
      removeBomStream("UTF-8"),
      concat(assertion),
      done,
    );
  });

  it("remove the BOM from a UTF8 buffer even if first chunk is shorter than 7 chars but second and subsequent are larger", function (t, done) {
    var filepath = path.join(__dirname, "./fixtures/bom-utf8.txt");
    var fileContent = fs.readFileSync(filepath);

    // UTF8 BOM takes up 3 characters in the buffer
    var expected = fileContent.subarray(3);

    function assertion(data) {
      assert.deepStrictEqual(data, expected);
    }

    var reader = new Readable();
    pipeline(reader, removeBomStream("utf-8"), concat(assertion), done);

    reader.push(fileContent.subarray(0, 5));
    reader.push(fileContent.subarray(5));
    reader.push(null);
  });

  it("does not remove the BOM from a UTF16BE buffer", function (t, done) {
    var filepath = path.join(__dirname, "./fixtures/bom-utf16be.txt");

    var expected = fs.readFileSync(filepath);

    function assertion(data) {
      assert.deepStrictEqual(data, expected);
    }

    pipeline(
      [
        fs.createReadStream(filepath),
        removeBomStream("utf-16be"),
        concat(assertion),
      ],
      done,
    );
  });

  it("does not remove the BOM from a UTF16BE buffer that is shorter than 7 chars", function (t, done) {
    var filepath = path.join(__dirname, "./fixtures/bom-utf16be-short.txt");

    var expected = fs.readFileSync(filepath);

    function assertion(data) {
      assert.deepStrictEqual(data, expected);
    }

    pipeline(
      fs.createReadStream(filepath),
      removeBomStream("utf-16be"),
      concat(assertion),
      done,
    );
  });

  it("does not remove the BOM from a UTF16LE buffer", function (t, done) {
    var filepath = path.join(__dirname, "./fixtures/bom-utf16le.txt");

    var expected = fs.readFileSync(filepath);

    function assertion(data) {
      assert.deepStrictEqual(data, expected);
    }
    pipeline(
      [
        fs.createReadStream(filepath),
        removeBomStream("utf-16le"),
        concat(assertion),
      ],
      done,
    );
  });
});
