import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {serve, enlargeText, inspectPage} from '../lib/browser-checks.mjs';
import {mkdtemp, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

test('local server accepts a trailing slash and returns actual error status', async () => {
  const root = await mkdtemp(join(tmpdir(), 'taste-server-'));
  await writeFile(join(root, 'index.html'), '<p>readable</p>');
  const server = await serve(root + '/');
  try {
    const response = await fetch(server.url + '/');
    assert.equal(response.status, 200);
    assert.match(await response.text(), /readable/);
    assert.equal((await fetch(server.url + '/missing.css')).status, 404);
    assert.equal((await fetch(server.url + '/..%2foutside.txt')).status, 403);
  } finally {await server.close(); await rm(root, {recursive: true});}
});

test('text stress doubles explicit and inherited sizes once; audit catches clipping and low contrast', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({viewport: {width: 320, height: 500}});
    await page.setContent('<style>body{font-size:20px}.explicit{font-size:12px}.clip{height:10px;overflow:hidden}.bad{color:#eee}</style><p><span id="inherited">inherited</span><span class="explicit">fixed</span></p><p class="clip">Clipped text</p><p class="bad">Low contrast text</p><p hidden>Hidden text</p>');
    await enlargeText(page);
    assert.equal(await page.locator('#inherited').evaluate(element => getComputedStyle(element).fontSize), '40px');
    assert.equal(await page.locator('.explicit').evaluate(element => getComputedStyle(element).fontSize), '24px');
    const report = await inspectPage(page);
    assert(report.clippedText.some(item => item.text === 'Clipped text'));
    assert(report.contrast.some(item => item.text === 'Low contrast text'));
    assert(!report.contrast.some(item => item.text === 'Hidden text'));
  } finally {await browser.close();}
});
