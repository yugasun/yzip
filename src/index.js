const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');
const ora = require('ora');

/**
 * resolve file path
 * @param {string} filename file path
 */
function resolve(filename) {
  return path.resolve(process.cwd(), filename);
}

/**
 * whether is directory
 * @param {string} filename file path
 */
function isDir(filename) {
  try {
    const stat = fs.statSync(filename);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
}

/**
 * make dir
 * @param {string} dirPath directory path
 */
function mkdir(dirPath) {
  if (!isDir(dirPath)) {
    fs.mkdirSync(dirPath, { recursize: true });
  }
  return true;
}

/**
 * convert decimal number to octal string
 * @param {number} num number
 */
function getOctalStr(num) {
  return '0o' + (num & 0o777).toString(8);
}

function getFileStat(filePath) {
  const file = fs.statSync(filePath);
  return { path: file, mode: getOctalStr(file.mode) };
}

/**
 * read path files
 * @param {string} input input path
 */
async function readFiles(input) {
  const inputPath = path.resolve(input);
  const base = path.resolve(process.cwd(), input);
  const files = [];
  let totalSize = 0;

  const readDir = async (dir) => {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.resolve(dir, item);
      const relativeItemPath = path.relative(base, itemPath);

      try {
        const fsItem = fs.statSync(itemPath);
        if (fsItem.isDirectory()) {
          await readDir(itemPath);
        } else {
          totalSize += fsItem.size;
          files.push({ path: relativeItemPath, mode: getOctalStr(fsItem.mode) });
        }
      } catch (e) {
        console.log(`Can not read dir for ${dir}:${e.message}`);
      }
    }
  };

  await readDir(inputPath);

  return { files, totalSize };
}

/**
 * zip method
 * @param {string} input input path
 * @param {string} output output zip filename
 */
async function zipCommand(input = process.cwd(), output = 'output.zip') {
  const spinner = ora().start('Start zipping...\n');

  try {
    const inputPath = resolve(input);
    const outputPath = resolve(output);
    const zip = new AdmZip();

    if (isDir(inputPath)) {
      const { files } = await readFiles(inputPath);
      files.forEach((item) => {
        const itemPath = path.resolve(inputPath, item.path);
        zip.addFile(item.path, fs.readFileSync(itemPath), '', Number(item.mode));
      });
    } else {
      const fsItem = getFileStat(inputPath);
      zip.addFile(fsItem.path, fs.createReadStream(inputPath), '', fsItem.mode);
      zip.addFile(inputPath);
    }
    zip.writeZip(outputPath);
    spinner.succeed(`Zip success to ${outputPath}`);
  } catch (e) {
    spinner.fail(`[Zip Error]: ${e.message}`);
  }
}

/**
 * unzip method
 * @param {string} input input zip filename
 * @param {string} output output dir
 */
async function unzipCommand(input, output = process.cwd(), overwrite = true) {
  const spinner = ora().start('Start unzipping...\n');

  try {
    if (!input) {
      throw new Error('Please input zip file to extract');
    }

    const inputPath = resolve(input);
    const zip = new AdmZip(inputPath);

    const outputPath = resolve(output);

    mkdir(outputPath);
    zip.extractAllTo(outputPath, overwrite);
    spinner.succeed(`Unzip success to ${outputPath}`);
  } catch (e) {
    spinner.fail(`[Unzip Error]: ${e.message}`);
  }
}

module.exports = {
  zip: zipCommand,
  unzip: unzipCommand,
};
