const path = require('path');
const fs = require('fs');
const { zip, unzip } = require('../src');

function resolve(str) {
  return path.resolve(__dirname, str);
}

describe('yzip test', () => {
  const outputDir = resolve('output');
  const zipDir = resolve('fixtures');
  const zipFile = resolve('output/test.zip');

  beforeAll(() => {
    fs.mkdirSync(outputDir, {
      recursive: true,
    });
  });
  afterAll(() => {
    fs.rmdirSync(outputDir, {recursive: true});
  });

  test('zip command', async () => {
    await zip(zipDir, zipFile);
    expect(fs.existsSync(zipFile)).toBe(true);
  });

  test('unzip command', async () => {
    await unzip(zipFile, outputDir);

    expect(fs.existsSync(resolve(outputDir, 'hello.txt'))).toBe(true);
  });
})
;
