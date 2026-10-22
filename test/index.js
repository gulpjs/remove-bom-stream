"use strict";

var fs = require("node:fs");
var path = require("node:path");
var assert = require("node:assert");
var { describe, it } = require("node:test");
var { pipeline, Readable, Writable } = require("node:stream");

var removeBomStream = require("../");

function concat(fn) {
  var chunks = [];
  return new Writable({
    write(data, _, cb) {
      chunks.push(data);
      cb();
    },
    final(cb) {
      fn(Buffer.concat(chunks));
      cb();
    },
  });
}

describe("removeBomStream", function () {
  it("defaults to UTF8 encoding if not specified", function (t, done) {
    var filepath = path.join(__dirname, "./fixtures/test.txt");

    var expected = fs.readFileSync(filepath);

    function assertion(data) {
      assert.deepStrictEqual(data, expected);
    }

    pipeline(
      fs.createReadStream(filepath),
      removeBomStream(),
      concat(assertion),
      done,
    );
  });

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
    var fileContent = fs.readFileSync(filepath);

    var expected = fileContent.subarray(3);

    function assertion(data) {
      assert.fail();
      assert.deepStrictEqual(data, expected);
    }
    var reader = new Readable();
    pipeline(reader, removeBomStream("UTF8"), concat(assertion), done);
    for (var byte of fileContent) {
      reader.push(Buffer.from([byte]));
    }
    reader.push(null);
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

  it("does not remove a UTF8 BOM from a UTF16BE buffer", function (t, done) {
    var filepath = path.join(__dirname, "./fixtures/utf16be-with-utf8-bom.txt");

    var encoding = "utf-16be";

    var rawContents = fs.readFileSync(filepath);
    var decoder = new TextDecoder(encoding);
    var expected = Buffer.from(decoder.decode(rawContents));

    function assertion(data) {
      assert.deepStrictEqual(data, expected);
    }

    pipeline(
      fs.createReadStream(filepath),
      removeBomStream(encoding),
      concat(assertion),
      done,
    );
  });

  it("removes a UTF16BE BOM from a UTF16BE buffer", function (t, done) {
    var filepath = path.join(__dirname, "./fixtures/utf16be-with-bom.txt");

    var encoding = "utf-16be";

    var rawContents = fs.readFileSync(filepath).subarray(2);
    var decoder = new TextDecoder(encoding);
    var expected = Buffer.from(decoder.decode(rawContents));

    function assertion(data) {
      assert.deepStrictEqual(data, expected);
    }

    pipeline(
      fs.createReadStream(filepath),
      removeBomStream(encoding),
      concat(assertion),
      done,
    );
  });

  it("removes the BOM from a UTF16BE buffer that is shorter than 7 chars", function (t, done) {
    var filepath = path.join(
      __dirname,
      "./fixtures/short-utf16be-with-bom.txt",
    );

    var encoding = "utf-16be";

    var rawContents = fs.readFileSync(filepath).subarray(2);
    var decoder = new TextDecoder(encoding);
    var expected = Buffer.from(decoder.decode(rawContents));

    function assertion(data) {
      assert.deepStrictEqual(data, expected);
    }

    pipeline(
      fs.createReadStream(filepath),
      removeBomStream(encoding),
      concat(assertion),
      done,
    );
  });

  it("remove the BOM from a UTF16BE buffer even if first chunk is shorter than 2 chars but second and subsequent are larger", function (t, done) {
    var filepath = path.join(__dirname, "./fixtures/utf16be-with-bom.txt");
    var fileContent = fs.readFileSync(filepath);

    var encoding = "utf-16be";

    // UTF16 BOM takes up 2 characters in the buffer
    var rawContents = fileContent.subarray(2);
    var decoder = new TextDecoder(encoding);
    var expected = Buffer.from(decoder.decode(rawContents));

    function assertion(data) {
      assert.deepStrictEqual(data, expected);
    }

    var reader = new Readable();
    pipeline(reader, removeBomStream(encoding), concat(assertion), done);

    reader.push(fileContent.subarray(0, 1));
    reader.push(fileContent.subarray(1));
    reader.push(null);
  });

  it("does not remove a UTF8 BOM from a UTF16LE buffer", function (t, done) {
    var filepath = path.join(__dirname, "./fixtures/utf16le-with-utf8-bom.txt");

    var encoding = "utf-16le";

    var rawContents = fs.readFileSync(filepath);
    var decoder = new TextDecoder(encoding);
    var expected = Buffer.from(decoder.decode(rawContents));

    function assertion(data) {
      assert.deepStrictEqual(data, expected);
    }
    pipeline(
      fs.createReadStream(filepath),
      removeBomStream(encoding),
      concat(assertion),
      done,
    );
  });

  it("remove a UTF16LE BOM from a UTF16LE buffer", function (t, done) {
    var filepath = path.join(__dirname, "./fixtures/utf16le-with-bom.txt");

    var encoding = "utf-16le";

    var rawContents = fs.readFileSync(filepath).subarray(2);
    var decoder = new TextDecoder(encoding);
    var expected = Buffer.from(decoder.decode(rawContents));

    function assertion(data) {
      assert.deepStrictEqual(data, expected);
    }
    pipeline(
      fs.createReadStream(filepath),
      removeBomStream(encoding),
      concat(assertion),
      done,
    );
  });

  it("removes the BOM from a UTF16LE buffer that is shorter than 7 chars", function (t, done) {
    var filepath = path.join(
      __dirname,
      "./fixtures/short-utf16le-with-bom.txt",
    );

    var encoding = "UTF-16LE";

    var rawContents = fs.readFileSync(filepath).subarray(2);
    var decoder = new TextDecoder(encoding);
    var expected = Buffer.from(decoder.decode(rawContents));

    function assertion(data) {
      assert.ok(data.length < 7);
      assert.ok(expected.length < 7);
      assert.deepStrictEqual(data, expected);
    }

    pipeline(
      fs.createReadStream(filepath),
      removeBomStream(encoding),
      concat(assertion),
      done,
    );
  });

  it("remove the BOM from a UTF16LE buffer even if first chunk is shorter than 2 chars but second and subsequent are larger", function (t, done) {
    var filepath = path.join(__dirname, "./fixtures/utf16le-with-bom.txt");
    var fileContent = fs.readFileSync(filepath);

    var encoding = "utf-16le";

    // UTF16 BOM takes up 2 characters in the buffer
    var rawContents = fileContent.subarray(2);
    var decoder = new TextDecoder(encoding);
    var expected = Buffer.from(decoder.decode(rawContents));

    function assertion(data) {
      assert.deepStrictEqual(data, expected);
    }

    var reader = new Readable();
    pipeline(reader, removeBomStream(encoding), concat(assertion), done);

    reader.push(fileContent.subarray(0, 1));
    reader.push(fileContent.subarray(1));
    reader.push(null);
  });
});
