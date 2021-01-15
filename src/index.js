const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

function resolve(filename) {
  return path.resolve(process.cwd(), filename);
}

function isDir(filename) {
  try {
    const stat = fs.statSync(filename);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
}

function mkdir(dirPath) {
  if (!isDir(dirPath)) {
    fs.mkdirSync(dirPath, { recursize: true });
  }
  return true;
}

async function zipCommand(input = process.cwd(), output = 'output.zip') {
  const inputPath = resolve(input);
  const outputPath = resolve(output);

  const zip = new AdmZip();

  if (isDir(inputPath)) {
    zip.addLocalFolder(inputPath);
  } else {
    zip.addLocalFile(inputPath);
  }

  zip.writeZip(outputPath);
}

async function unzipCommand(input, output = process.cwd()) {
  if (!input) {
    throw new Error('Please input zip file to extract');
  }

  const inputPath = resolve(input);

  const zip = new AdmZip(inputPath);

  const outputPath = resolve(output);

  mkdir(outputPath);
  zip.extractAllTo(outputPath);
}

module.exports = {
  zip: zipCommand,
  unzip: unzipCommand,
};
