#!/usr/bin/env node

import {unrar} from 'unrar-promise';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {readFile} from 'fs/promises';
import {resolve, basename, extname} from 'path';

const pkg = JSON.parse(
  await readFile(new URL('./package.json', import.meta.url))
)

const {argv} = yargs(hideBin(process.argv))
  .scriptName('unrar')
  .usage('$0 <input> [options]', 'unrar input file')
  .demandCommand(1, 'You must provide an input file')
  .options({
    'output': {
      alias: 'o',
      describe: 'Output directory',
      type: 'string',
    },
  })
  .options({
    'password': {
      alias: 'p',
      describe: 'Password',
      type: 'string',
    },
  })
  .options({
    'overwrite': {
      alias: 'y',
      describe: 'Overwrite existing files',
      type: 'boolean',
      default: true,
    },
  })
  .help('help')
  .version(pkg.version);

let {
  input,
  output,
  overwrite,
  password = '',
} = argv;
output = resolve(process.cwd(), output || basename(input, extname(input)));
console.log(`unrar ${input} to ${output}`);

await unrar(input, output, {
  password,
  overwrite,
});

console.log('unrar done');
