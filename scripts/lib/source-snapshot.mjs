import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';

export async function captureSources(root, paths) {
  const entries = await Promise.all(paths.map(async path => [path, await readFile(resolve(root, path))]));
  return {
    files: new Map(entries.map(([path, bytes]) => [resolve(root, path), bytes])),
    hashes: Object.fromEntries(entries.map(([path, bytes]) => [path, createHash('sha256').update(bytes).digest('hex')]))
  };
}
