#!/usr/bin/env node

const { program } = require('commander');
const { zip, unzip } = require('../src');

async function run() {
  program
    .option('-x, --extract', 'Whether to extract zip')
    .option('-i, --input <input>', 'Folder need to be comporessed or zip file to be extracted')
    .option('-o, --output <output>', 'Output filename or path')
    .option('-r, --replace', 'Extract to overwrite exist file');

  program.parse(process.argv);

  // Check the program.args obj
  const NO_COMMAND_SPECIFIED = program.rawArgs.length <= 2;

  // Handle it however you like
  if (NO_COMMAND_SPECIFIED) {
    // e.g. display usage
    program.help();
  }

  const { extract = false, input, output, replace = true } = program;

  if (extract) {
    unzip(input, output, replace);
  } else {
    zip(input, output);
  }
}

run();

process.on('unhandledRejection', (error) => console.log(error));
