import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium, firefox, webkit} from '@playwright/test';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
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

test('library states reflow and native pointer padding activates each document', async () => {
  const {libraryStates, setupLibraryState, assertLibraryState, assertLibraryPointerTargets} = await import('../lib/library-checks.mjs');
  const {enlargeText, inspectPage, waitForFonts} = await import('../lib/browser-checks.mjs');
  const server = await serve(root), browser = await engine.launch();
  try {
    for (const state of libraryStates) {
      const page = await browser.newPage({viewport: {width: 320, height: 960}});
      await page.goto(server.url + '/eval/cycles/04/index.html'); await waitForFonts(page);
      await setupLibraryState(page, state); await enlargeText(page); await assertLibraryState(page, state);
      const audit = await inspectPage(page);
      let diagnostic;
      if (audit.overflow) {
        diagnostic = await page.evaluate(() => ({
          fonts: {status: document.fonts.status, faces: [...document.fonts].map(face => ({family: face.family, status: face.status}))},
          viewport: {inner: innerWidth, client: document.documentElement.clientWidth},
          boxes: ['header', '.brand', '#theme', 'h1', '#view', '#bulk'].map(selector => {const element = document.querySelector(selector), style = getComputedStyle(element); return {selector, rect: element.getBoundingClientRect().toJSON(), font: style.font, whiteSpace: style.whiteSpace};})
        }));
        await mkdir('.artifacts/browser', {recursive: true});
        await writeFile(`.artifacts/browser/library-overflow-${state}.json`, JSON.stringify({state, audit, diagnostic}, null, 2));
        await page.screenshot({path: `.artifacts/browser/library-overflow-${state}.png`, fullPage: true});
      }
      assert.equal(audit.overflow, false, JSON.stringify({state, audit, diagnostic})); assert.deepEqual(audit.smallTargets, []); assert.deepEqual(audit.clippedTabStops, []);
      await page.close();
    }
    for (const [width, touch] of [[1440, false], [320, false], [320, true]]) {
      const page = await browser.newPage({viewport: {width, height: 960}, hasTouch: touch});
      await page.goto(server.url + '/eval/cycles/04/index.html');
      await assertLibraryPointerTargets(page, {touch}); await assertLibraryState(page, 'active'); await page.close();
    }
    const header = await browser.newPage({viewport: {width: 320, height: 960}});
    await header.goto(server.url + '/eval/cycles/04/index.html'); await waitForFonts(header);
    await header.addStyleTag({content: '.brand{min-width:178px}#theme{min-width:112px}'});
    assert.equal((await inspectPage(header)).overflow, false);
    await header.addStyleTag({content: 'header{flex-wrap:nowrap}'});
    assert.equal((await inspectPage(header)).overflow, true);
    await header.close();
    const heading = await browser.newPage({viewport: {width: 320, height: 960}});
    await heading.goto(server.url + '/eval/cycles/04/index.html'); await waitForFonts(heading);
    await heading.locator('h1').evaluate(element => element.textContent = 'Documentenbibliotheek'); await enlargeText(heading);
    const wrapped = await inspectPage(heading);
    assert.equal(wrapped.overflow, false); assert.deepEqual(wrapped.clippedText, []);
    assert.equal(await heading.locator('h1').textContent(), 'Documentenbibliotheek');
    await heading.addStyleTag({content: 'h1{overflow-wrap:normal}'});
    assert.equal((await inspectPage(heading)).overflow, true);
    await heading.close();
    const empty = await browser.newPage({viewport: {width: 320, height: 960}});
    await empty.goto(server.url + '/eval/cycles/04/index.html'); await setupLibraryState(empty, 'empty');
    await empty.addStyleTag({content: 'td.empty {grid-column:1}'});
    await assert.rejects(assertLibraryState(empty, 'empty'), error => error instanceof assert.AssertionError && error.message.includes('Empty state must span the row'));
    await empty.close();
    const page = await browser.newPage({viewport: {width: 320, height: 960}});
    await page.goto(server.url + '/eval/cycles/04/index.html');
    await page.locator('[data-id="1"] [data-label="Owner"]').evaluate(element => element.textContent = 'Wrong owner');
    await assert.rejects(assertLibraryState(page, 'active'), error => error instanceof assert.AssertionError && error.actual?.[0] === 'Wrong owner' && error.expected?.[0] === 'Mara Ionescu');
    await page.addStyleTag({content: '.selection-target, .selection-target input {pointer-events:none}'});
    await assert.rejects(assertLibraryPointerTargets(page), error => error instanceof assert.AssertionError && error.expected === 'INPUT' && error.actual === 'TD');
  } finally {await browser.close(); await server.close();}
});

test('library retains reading without scripts or after initialization failure', async () => {
  const {assertLibraryReading} = await import('../lib/library-checks.mjs');
  const {inspectPage, waitForFonts, enlargeText} = await import('../lib/browser-checks.mjs');
  const server = await serve(root), browser = await engine.launch();
  const source = await readFile(new URL('../../eval/cycles/04/index.html', import.meta.url), 'utf8');
  const faults = {
    media: "window.matchMedia=()=>{throw new Error('Injected media initialization failure')};",
    date: "const Format=Intl.DateTimeFormat;let calls=0;Intl.DateTimeFormat=function(...args){if(++calls===2)throw new Error('Injected date formatter failure');return new Format(...args)};"
  };
  try {
    for (const mode of ['disabled', 'media', 'date']) {
      const page = await browser.newPage({javaScriptEnabled: mode !== 'disabled', viewport: {width: 320, height: 960}});
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      if (faults[mode]) await page.addInitScript(faults[mode]);
      await page.goto(server.url + '/eval/cycles/04/index.html'); await waitForFonts(page); await enlargeText(page);
      await assertLibraryReading(page);
      assert.deepEqual(errors, mode === 'disabled' ? [] : [mode === 'media' ? 'Injected media initialization failure' : 'Injected date formatter failure']);
      const audit = await inspectPage(page); assert.equal(audit.overflow, false); assert.deepEqual(audit.clippedTabStops, []); assert.deepEqual(audit.clippedText, []);
      if (mode === 'disabled') {
        await page.evaluate(() => {const style = document.createElement('style'); style.id = 'dimmed-reading-labels'; style.textContent = 'th button:disabled{opacity:.5}'; document.head.append(style);});
        await assert.rejects(assertLibraryReading(page), error => error instanceof assert.AssertionError && /Reading column labels must retain full opacity/.test(error.message));
        await page.evaluate(() => document.getElementById('dimmed-reading-labels').remove());
        await page.locator('#view').evaluate(control => control.disabled = false);
        await assert.rejects(assertLibraryReading(page), error => error instanceof assert.AssertionError && /Unavailable controls/.test(error.message));
      }
      await page.close();
    }
    const discarded = await browser.newPage({viewport: {width: 320, height: 960}});
    const build = 'const list=visible(),fragment=document.createDocumentFragment();';
    assert.equal(source.split(build).length - 1, 1);
    await discarded.route('**/eval/cycles/04/index.html', route => route.fulfill({contentType: 'text/html', body: source.replace(build, "$('rows').replaceChildren();" + build)}));
    await discarded.addInitScript(faults.date);
    await discarded.goto(server.url + '/eval/cycles/04/index.html');
    await assert.rejects(assertLibraryReading(discarded), error => error instanceof assert.AssertionError && error.actual?.length === 0 && error.expected?.length === 8);
    await discarded.close();
    const derived = await browser.newPage({viewport: {width: 1440, height: 960}});
    const modified = source.replace('data-label="Owner">Mara Ionescu', 'data-label="Owner">Casey Taylor').replace('datetime="2026-10-09"', 'datetime="2026-10-01"');
    assert.notEqual(modified, source);
    await derived.route('**/eval/cycles/04/index.html', route => route.fulfill({contentType: 'text/html', body: modified}));
    await derived.goto(server.url + '/eval/cycles/04/index.html');
    assert.equal(await derived.locator('[data-id="1"] [data-label="Owner"]').textContent(), 'Casey Taylor');
    assert.equal(await derived.locator('[data-id="1"] time').textContent(), '1 Oct 2026');
    assert.deepEqual(await derived.locator('#rows tr[data-id]').evaluateAll(rows => rows.map(row => Number(row.dataset.id))), [2, 3, 4, 5, 6, 7, 1, 8]);
  } finally {await browser.close(); await server.close();}
});
