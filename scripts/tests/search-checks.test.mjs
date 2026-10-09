import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium, firefox, webkit} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {serve} from '../lib/browser-checks.mjs';
import {installSearchClock, pauseSearchClock, assertSearchTransitions} from '../lib/search-checks.mjs';
const engine = {chromium, firefox, webkit}[process.env.TASTE_TEST_BROWSER ?? 'chromium'];
if (!engine) throw new Error('Unknown TASTE_TEST_BROWSER');
const root = fileURLToPath(new URL('../../', import.meta.url));

test('search covers query fields and rejects an obsolete response', async () => {
  const server = await serve(root), browser = await engine.launch();
  try {
    const source = await readFile(new URL('../../eval/cycles/09/index.html', import.meta.url), 'utf8');
    assert.equal(source.split('if (id !== generation) return;').length - 1, 2);
    const defective = source.replaceAll('if (id !== generation) return;', '');
    const healthy = await browser.newPage({viewport: {width: 320, height: 960}});
    await installSearchClock(healthy);
    await healthy.goto(server.url + '/eval/cycles/09/index.html'); await pauseSearchClock(healthy);
    await assertSearchTransitions(healthy);
    for (const [query, titles] of [
      ['Mara Bell', ['A cooler summer starts with street trees', 'Who gets space on the high street?']],
      ['night train', ['The night train returns to the timetable']]
    ]) {
      await healthy.locator('#query').fill(query); await healthy.locator('#query').press('Enter'); await healthy.clock.runFor(450);
      assert.deepEqual(await healthy.locator('#results summary').allTextContents(), titles);
      assert.equal(await healthy.locator('#status').textContent(), `${titles.length} ${titles.length === 1 ? 'result' : 'results'} for "${query}".`);
    }
    await healthy.close();
    const page = await browser.newPage({viewport: {width: 320, height: 960}});
    await installSearchClock(page);
    await page.route('**/eval/cycles/09/index.html', route => route.fulfill({body: defective, contentType: 'text/html'}));
    await page.goto(server.url + '/eval/cycles/09/index.html'); await pauseSearchClock(page);
    await assert.rejects(assertSearchTransitions(page), error => error instanceof assert.AssertionError && error.actual?.status === '6 results for "slow".' && error.actual?.titles.length === 6);
  } finally {await browser.close(); await server.close();}
});
