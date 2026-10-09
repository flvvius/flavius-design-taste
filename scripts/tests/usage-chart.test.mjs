import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium, firefox, webkit} from '@playwright/test';
import {fileURLToPath} from 'node:url';
import {serve} from '../lib/browser-checks.mjs';
import {assertUsageChart} from '../lib/usage-chart-checks.mjs';
const engine = {chromium, firefox, webkit}[process.env.TASTE_TEST_BROWSER ?? 'chromium'];
if (!engine) throw new Error('Unknown TASTE_TEST_BROWSER');
const root = fileURLToPath(new URL('../../', import.meta.url));

test('chart audit detects an erased series pattern and a misleading value scale', async () => {
  const server = await serve(root), browser = await engine.launch();
  try {
    const page = await browser.newPage({forcedColors: 'active', viewport: {width: 320, height: 960}});
    await page.goto(server.url + '/eval/cycles/07/index.html');
    await page.locator('details summary').click();
    await assertUsageChart(page, 'week');
    await page.addStyleTag({content: '.previous {background-image: none !important}'});
    await assert.rejects(assertUsageChart(page, 'week'), /Solid and striped/);
    await page.reload();
    await page.locator('details summary').click();
    await page.addStyleTag({content: '.bar.current {width: 50% !important}'});
    await assert.rejects(assertUsageChart(page, 'week'), /common scale/);
  } finally {await browser.close(); await server.close();}
});
