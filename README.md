# yzip

[![Build Status](https://github.com/yugasun/yzip/workflows/Test/badge.svg)](https://github.com/yugasun/yzip/actions?query=workflow:Test)
[![npm](https://img.shields.io/npm/v/yzip.svg)](http://www.npmtrends.com/yzip)
[![NPM downloads](https://img.shields.io/npm/dm/yzip.svg)](http://www.npmtrends.com/yzip)

Zip command depend on adm-zip.

## Usage

Zip directory into zip file:

```bash
$ yzip -i ./src -o archive.zip
```

Unzip file:

```bash
$ yzip -x -i ./archive.zip -o ./output
```

## TODO

- [x] zip
- [x] unzip

## License

MIT License

Copyright (c) 2020 Yuga Sun
