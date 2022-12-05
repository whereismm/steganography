# Steganography
<a name = "Installation"></a>
## Installation
This project is on [NodeJS](https://nodejs.org/en/). You can install it from this repository directly:
```
    git clone https://github.com/whereismm/steganography.git
    cd steganography
    npm update && npm run dev-build
```
## Using
```
Usage: node build/index.js -i <input file path> -o <output file path> -d <decode
(optional)> -e <output file encoding 'binary' | 'utf-8' (default=binary)>

Options:
      --version      Show version number                               [boolean]
  -i, --input        Input file path                         [string] [required]
  -o, --output       Output file path                        [string] [required]
  -d, --decode       The input file is a bmp image to be decoded
  -e, --encode_type  Output file encoding type. Valid options: binary | utf-8.
                     Default=utf-8                                      [string]
      --help         Show help                                         [boolean]
```