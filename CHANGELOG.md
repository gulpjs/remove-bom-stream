# Changelog

## [3.0.0](https://github.com/gulpjs/remove-bom-stream/compare/v2.0.0...v3.0.0) (2026-10-08)


### ⚠ BREAKING CHANGES

* Normalize repository, dropping Node <22.15.0 ([#14](https://github.com/gulpjs/remove-bom-stream/issues/14))

### Miscellaneous Chores

* Normalize repository, dropping Node &lt;22.15.0 ([#14](https://github.com/gulpjs/remove-bom-stream/issues/14)) ([1a61c5d](https://github.com/gulpjs/remove-bom-stream/commit/1a61c5d88a50ab5e0e30a72bb18d92d159b10b7c))

## [2.0.0](https://www.github.com/gulpjs/remove-bom-stream/compare/v1.2.0...v2.0.0) (2022-04-19)


### ⚠ BREAKING CHANGES

* Switch to streamx for streams (#10)
* Require encoding option to avoid inspecting chunks for UTF-8 encoding (#8)
* Normalize repository, dropping node <10.13 support (#3)

### Features

* Remove the dependency on `remove-bom-buffer` ([2107f34](https://www.github.com/gulpjs/remove-bom-stream/commit/2107f343cf48a5032fd0a8c2af09cc882f77c12c))
* Require encoding option to avoid inspecting chunks for UTF-8 encoding ([#8](https://www.github.com/gulpjs/remove-bom-stream/issues/8)) ([2107f34](https://www.github.com/gulpjs/remove-bom-stream/commit/2107f343cf48a5032fd0a8c2af09cc882f77c12c))
* Switch to streamx for streams ([#10](https://www.github.com/gulpjs/remove-bom-stream/issues/10)) ([9867811](https://www.github.com/gulpjs/remove-bom-stream/commit/9867811537f4a26facdc3b4e816d371c206a9537))
* Use node core's `TextDecoder` to process beginning of stream ([2107f34](https://www.github.com/gulpjs/remove-bom-stream/commit/2107f343cf48a5032fd0a8c2af09cc882f77c12c))


### Bug Fixes

* Handle first chunk shorter than 7 bytes correctly when next chunks are larger ([#7](https://www.github.com/gulpjs/remove-bom-stream/issues/7)) ([564f87b](https://www.github.com/gulpjs/remove-bom-stream/commit/564f87b7760210f0aa348d82ea01fe5d98b4c20a))


### Miscellaneous Chores

* Normalize repository, dropping node <10.13 support ([#3](https://www.github.com/gulpjs/remove-bom-stream/issues/3)) ([8fece9c](https://www.github.com/gulpjs/remove-bom-stream/commit/8fece9c9cc1760a3593d4c04fa275b3fe8867c35))
