import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium, firefox, webkit} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {serve} from '../lib/browser-checks.mjs';
import {assertLibraryFocus, assertLibraryActions} from '../lib/library-checks.mjs';
const engine = {chromium, firefox, webkit}[process.env.TASTE_TEST_BROWSER ?? 'chromium'];
if (!engine) throw new Error('Unknown TASTE_TEST_BROWSER');
const root = fileURLToPath(new URL('../../', import.meta.url));

test('library preserves responsive focus and archive history, and rejects focus loss', async () => {
  const server = await serve(root), browser = await engine.launch();
  try {
    const healthy = await browser.newPage({viewport: {width: 1440, height: 960}});
    await healthy.goto(server.url + '/eval/cycles/04/index.html');
    await assertLibraryFocus(healthy); await assertLibraryActions(healthy); await healthy.close();
    const source = await readFile(new URL('../../eval/cycles/04/index.html', import.meta.url), 'utf8');
    assert.equal(source.split('if(next&&!next.disabled)next.focus();').length - 1, 1);
    const defective = source.replace('if(next&&!next.disabled)next.focus();', '');
    const page = await browser.newPage({viewport: {width: 1440, height: 960}});
    await page.route('**/eval/cycles/04/index.html', route => route.fulfill({body: defective, contentType: 'text/html'}));
    await page.goto(server.url + '/eval/cycles/04/index.html');
    await assert.rejects(assertLibraryFocus(page), error => error instanceof assert.AssertionError && /Responsive focus.*name.*sort/.test(error.message) && error.message.includes('"focused":false'));
    await page.close();
    const reverseBranch = "if(!narrow.matches&&['sort','direction'].includes(previous?.id))next=";
    assert.equal(source.split(reverseBranch).length - 1, 1);
    const reverse = await browser.newPage({viewport: {width: 1440, height: 960}});
    await reverse.route('**/eval/cycles/04/index.html', route => route.fulfill({body: source.replace(reverseBranch, 'if(false)next='), contentType: 'text/html'}));
    await reverse.goto(server.url + '/eval/cycles/04/index.html');
    await assert.rejects(assertLibraryFocus(reverse), error => error instanceof assert.AssertionError && /Responsive focus #sort/.test(error.message) && error.message.includes('"focused":false'));
  } finally {await browser.close(); await server.close();}
});
