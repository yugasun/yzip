const path = require('path');
const { exec } = require('pkg');

(async () => {
  try {
    const binFile = path.join(process.cwd(), 'bin/yzip.js');
    await exec([binFile, '--targets', 'node14-linux-x64,node14-mac-x64', '--out-path', 'dist']);
  } catch (e) {
    // no op
  }
})();
