import {readFileSync, statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root = new URL('../', import.meta.url);
const inventory = JSON.parse(readFileSync(new URL('docs/restructure-inventory.json', root)));
for (const entry of inventory.files) {
  const path = new URL('eval/archive/' + entry.source, root);
  assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), entry.sha256, entry.source);
  assert.equal(Boolean(statSync(path).mode & 0o111), entry.gitMode === '100755', entry.source + ' executable mode');
}
console.log(`Verified all ${inventory.files.length} archived baseline files and executable modes.`);
