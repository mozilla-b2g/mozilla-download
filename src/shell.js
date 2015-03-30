import { exec } from 'child_process';

/**
 * @fileoverview Thin promise wrapper around ChildProcess#exec.
 */
export default function shell(command, options={}) {
  return new Promise((accept, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) return reject(error);
      if (stderr.length) return reject(new Error(stderr));
      accept(stdout);
    });
  });
}
