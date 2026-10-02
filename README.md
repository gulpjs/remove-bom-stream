<p align="center">
  <a href="https://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# remove-bom-stream

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][ci-image]][ci-url] [![Coveralls Status][coveralls-image]][coveralls-url]

Remove a UTF8 BOM at the start of the stream.

## Usage

```js
var fs = require("fs");
var concat = require("concat-stream");
var removeBOM = require("remove-bom-stream");

fs.createReadStream("utf8-file-with-bom.txt")
  .pipe(removeBOM("utf-8"))
  .pipe(
    concat(function (result) {
      // result won't have a BOM
    }),
  );
```

## API

### `removeBOM(encoding)`

Returns a `Transform` stream that will remove a BOM, if the argument `encoding` is `'utf-8'` and the given data is a UTF8 Buffer with a BOM at the beginning. If the `encoding` is not `'utf-8'` or does not have a BOM, the data is not changed and this becomes a no-op `Transform` stream.

## Strict No LLM / No AI Policy

No LLMs for issues.

No LLMs for patches / pull requests.

No LLMs for comments on the bug tracker, including translation.

English is encouraged, but not required. You are welcome to post in your native language and rely on others to have their own translation tools of choice to interpret your words.

## License

MIT

<!-- prettier-ignore-start -->
[downloads-image]: https://img.shields.io/npm/dm/remove-bom-stream.svg?style=flat-square
[npm-url]: https://npmjs.com/package/remove-bom-stream
[npm-image]: https://img.shields.io/npm/v/remove-bom-stream.svg?style=flat-square

[ci-url]: https://github.com/gulpjs/remove-bom-stream/actions/workflows/dev.yml
[ci-image]: https://img.shields.io/github/actions/workflow/status/gulpjs/remove-bom-stream/dev.yml?style=flat-square

[coveralls-url]: https://coveralls.io/r/gulpjs/remove-bom-stream
[coveralls-image]: https://img.shields.io/coveralls/gulpjs/remove-bom-stream/main.svg?style=flat-square
<!-- prettier-ignore-end -->
