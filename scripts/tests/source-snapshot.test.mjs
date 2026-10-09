import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {captureSources} from '../lib/source-snapshot.mjs';
import {serve} from '../lib/browser-checks.mjs';

test('browser evidence keeps the captured revision after edits and deleted assets', async () => {
  const root = await mkdtemp(join(tmpdir(), 'taste-snapshot-'));
  let server;
  try {
    const original = '<link rel="stylesheet" href="style.css"><p>Original revision</p>';
    await writeFile(join(root, 'index.html'), original);
    await writeFile(join(root, 'style.css'), 'p {color: black}');
    await writeFile(join(root, 'uncaptured.html'), 'Untracked input');
    const snapshot = await captureSources(root, ['index.html', 'style.css']);
    server = await serve(root, snapshot.files);
    await writeFile(join(root, 'index.html'), '<p>Edited during the run</p>');
    await rm(join(root, 'style.css'));
    assert.equal(await (await fetch(server.url + '/')).text(), original);
    assert.equal(await (await fetch(server.url + '/style.css')).text(), 'p {color: black}');
    assert.equal(snapshot.hashes['index.html'], createHash('sha256').update(original).digest('hex'));
    assert.equal((await fetch(server.url + '/uncaptured.html')).status, 404);
    assert.equal((await fetch(server.url + '/..%2foutside.txt')).status, 403);
  } finally {
    if (server) await server.close();
    await rm(root, {recursive: true, force: true});
  }
});
