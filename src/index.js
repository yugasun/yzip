const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

function join(filename) {
  return path.join(process.cwd(), filename);
}

function isDir(filename) {
  const stat = fs.statSync(filename);
  return stat.isDirectory();
}

async function zipCommand(input = process.cwd(), output = 'output.zip') {
  const inputPath = join(input);
  const outputPath = join(output);

  const zip = new AdmZip();

  if (isDir(inputPath)) {
    zip.addLocalFolder(inputPath);
  } else {
    zip.addLocalFile(inputPath);
  }

  zip.writeZip(outputPath);
}

module.exports = {
  zip: zipCommand,
};
