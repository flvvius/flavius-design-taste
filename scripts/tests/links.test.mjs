import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, writeFile, mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {checkLinks} from '../check-links.mjs';

test('links resolve encoded paths, references, anchors and CSS; isolated folders reject sibling dependencies', async () => {
  const root = await mkdtemp(join(tmpdir(), 'taste-links-'));
  await mkdir(join(root, 'skill'));
  await writeFile(join(root, 'shared.md'), '# Shared\n');
  await writeFile(join(root, 'skill', 'page name.md'), '# Page title\n');
  await writeFile(join(root, 'skill', 'index.md'), '[page][target]\n[target]: page%20name.md#page-title\n[sibling](../shared.md)\n');
  assert.deepEqual(checkLinks(root), []);
  assert.equal(checkLinks(join(root, 'skill'), {isolated: true})[0].reason, 'Dependency leaves the installed package');
  await writeFile(join(root, 'skill', 'style.css'), '@import "./missing.css"; p{background:url(missing.png)}');
  await writeFile(join(root, 'skill', 'bad.md'), '[page](page%20name.md#absent)\n');
  const failures = checkLinks(root);
  assert.equal(failures.length, 3);
  assert(failures.some(failure => failure.reason === 'Missing local anchor'));
});
