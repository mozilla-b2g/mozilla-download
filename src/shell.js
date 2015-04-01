import { exec } from 'child_process';
let debug = require('debug')('shell');

/**
 * @fileoverview Thin promise wrapper around ChildProcess#exec.
 */
export default function shell(command, options={}) {
  return new Promise((accept, reject) => {
    if (Array.isArray(command)) {
      command = command.join(' ');
    }

    debug(command, options);
    exec(command, options, (error, stdout, stderr) => {
      if (error) return reject(error);
      if (stderr.length) return reject(new Error(stderr));
      debug(stdout);
      accept(stdout);
    });
  });
}
