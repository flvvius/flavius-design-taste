import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {mkdir, writeFile, readFile, mkdtemp} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {serve, enlargeText, applyTextSpacing, inspectPage} from './lib/browser-checks.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const argumentsList = process.argv.slice(2);
const outputIndex = argumentsList.indexOf('--output');
if (outputIndex !== -1 && !argumentsList[outputIndex + 1]) throw new Error('--output requires a directory');
const output = outputIndex === -1 ? await mkdtemp(resolve(tmpdir(), 'taste-browser-')) : resolve(root, argumentsList[outputIndex + 1]);
await mkdir(output, {recursive: true});
let browser;
const reports = [], failures = [], interactions = [];
const requestedSurfaces = argumentsList.flatMap((value, index) => value === '--surface' ? [argumentsList[index + 1]] : []);
const allSurfaces = [
  {name: 'personal-room', path: 'examples/personal-room/index.html', themes: ['paper', 'night'], palette: '[data-palette]', setTheme: async (page, theme) => page.locator(`[data-palette="${theme}"]`).click()},
  {name: 'editorial-calm', path: 'examples/index.html', themes: ['light', 'dark'], setTheme: async (page, theme) => page.evaluate(theme => document.documentElement.classList.toggle('dark', theme === 'dark'), theme)},
  {name: 'repair-notebook', path: 'eval/cycles/12/index.html', themes: ['paper', 'night'], setTheme: async (page, theme) => page.locator(`[data-palette="${theme}"]`).click(), setup: async page => page.locator('#edit').click()}
];
for (const name of requestedSurfaces) if (!allSurfaces.some(surface => surface.name === name)) throw new Error(`Unknown surface: ${name}`);
const surfaces = allSurfaces.filter(surface => !requestedSurfaces.length || requestedSurfaces.includes(surface.name));
const variants = [
  {width: 320, mode: 'normal'}, {width: 390, mode: 'normal'}, {width: 768, mode: 'normal'}, {width: 1440, mode: 'normal'},
  {width: 320, mode: 'all-text-200'}, {width: 320, mode: 'spacing'},
  {width: 320, mode: 'forced-colors'}, {width: 1440, mode: 'forced-colors'}
];
const server = await serve(root);
async function check(name, operation) {
  try {await operation(); interactions.push({name, passed: true});}
  catch (error) {failures.push({name, message: error.message}); interactions.push({name, passed: false, message: error.message});}
}
try {
  browser = await chromium.launch();
  for (const surface of surfaces) for (const theme of surface.themes) for (const variant of variants) {
    const page = await browser.newPage({viewport: {width: variant.width, height: 960}, reducedMotion: 'reduce', forcedColors: variant.mode === 'forced-colors' ? 'active' : 'none'});
    const errors = [], requests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {if (response.status() >= 400) requests.push({url: response.url(), status: response.status()});});
    page.on('requestfailed', request => requests.push({url: request.url(), error: request.failure()?.errorText}));
    const response = await page.goto(`${server.url}/${surface.path}`, {waitUntil: 'networkidle'});
    assert(response?.ok(), `${surface.path} failed to load: ${response?.status()}`);
    await page.evaluate(() => document.fonts.ready);
    await surface.setTheme(page, theme);
    if (surface.setup) await surface.setup(page);
    if (variant.mode === 'all-text-200') await enlargeText(page);
    if (variant.mode === 'spacing') await applyTextSpacing(page);
    const audit = await inspectPage(page);
    const name = `${surface.name}-${theme}-${variant.width}-${variant.mode}`;
    reports.push({name, ...audit, errors, requests});
    const issues = audit.overflow || audit.outsideViewport.length || audit.clippedText.length || audit.contrast.length || audit.unlabeled.length || audit.smallTargets.length || errors.length || requests.length;
    if (issues) failures.push({name, audit, errors, requests});
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({path: resolve(output, `${name}.png`), fullPage: true, animations: 'disabled'});
    await page.close();
  }
  for (const surface of surfaces) {
    await check(`${surface.name} forced-colour keyboard focus and control boundaries`, async () => {
      const forced = await browser.newPage({forcedColors: 'active', viewport: {width: 320, height: 844}});
      try {
        await forced.goto(`${server.url}/${surface.path}`);
        assert(await forced.evaluate(() => matchMedia('(forced-colors: active)').matches));
        await forced.keyboard.press('Tab');
        const outline = await forced.locator(':focus').evaluate(element => {
          const style = getComputedStyle(element);
          return {visible: element.matches(':focus-visible'), style: style.outlineStyle, width: parseFloat(style.outlineWidth)};
        });
        assert(outline.visible && outline.style !== 'none' && outline.width >= 2);
        if (surface.palette) {
          await forced.locator('[data-palette="night"]').focus();
          await forced.keyboard.press('Space');
          assert.equal(await forced.locator('[data-palette="night"]').getAttribute('aria-pressed'), 'true');
          const markers = await forced.locator('[data-palette]').evaluateAll(elements => elements.map(element => ({pressed: element.getAttribute('aria-pressed'), underline: getComputedStyle(element).textDecorationLine.includes('underline')})));
          assert(markers.every(marker => marker.underline === (marker.pressed === 'true')), 'Selection must remain distinguishable after colour replacement');
        }
        if (surface.setup) await surface.setup(forced);
        const boundaries = await forced.locator('button, input, textarea, select').evaluateAll(elements => elements.filter(element => element.getClientRects().length).map(element => {
          const style = getComputedStyle(element);
          return {name: element.id || element.textContent.trim(), width: parseFloat(style.borderTopWidth), style: style.borderTopStyle, color: style.borderTopColor, background: style.backgroundColor};
        }));
        assert(boundaries.length);
        assert(boundaries.every(boundary => boundary.width >= 1 && boundary.style !== 'none' && boundary.color !== boundary.background), JSON.stringify(boundaries));
      } finally {await forced.close();}
    });
  }
  const page = await browser.newPage({viewport: {width: 390, height: 844}});
  if (surfaces.some(surface => surface.name === 'personal-room')) {
  await page.goto(`${server.url}/examples/personal-room/index.html`);
  await check('font loads', async () => {await page.evaluate(() => document.fonts.ready); assert(await page.evaluate(() => document.fonts.check('24px Schoolbell')));});
  await check('repeat project activation reopens story', async () => {
    const link = page.locator('.object-link').first(), summary = page.locator('#project-walks summary');
    await link.click(); await summary.click(); assert(!(await page.locator('#project-walks').evaluate(element => element.open)));
    await link.click(); assert(await page.locator('#project-walks').evaluate(element => element.open));
  });
  await check('keyboard project activation focuses visible summary', async () => {
    await page.locator('.object-link').nth(1).focus(); await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.activeElement?.matches('#project-notes summary'));
    await page.waitForFunction(() => {
      const rect = document.activeElement.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= innerHeight;
    }, undefined, {timeout: 3000});
    const rect = await page.locator(':focus').boundingBox(); assert(rect && rect.y >= 0 && rect.y + rect.height <= 844, JSON.stringify(rect));
  });
  await check('skip link reaches main', async () => {
    await page.goto(`${server.url}/examples/personal-room/index.html`); await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').getAttribute('class'), 'skip'); await page.keyboard.press('Enter'); assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
  });
  await check('palette keyboard activation preserves focus and pressed state', async () => {
    const button = page.locator('[data-palette="night"]'); await button.focus(); await page.keyboard.press('Space');
    assert.equal(await button.getAttribute('aria-pressed'), 'true'); assert(await button.evaluate(element => element === document.activeElement));
  });
  await check('reduced motion suppresses travel', async () => {
    await page.emulateMedia({reducedMotion: 'reduce'});
    assert.equal(await page.locator('html').evaluate(element => getComputedStyle(element).scrollBehavior), 'auto');
    assert.equal(await page.locator('.object-link svg').first().evaluate(element => getComputedStyle(element).transitionDuration), '0s');
  });
  await check('touch hover does not lift objects', async () => {
    const touch = await browser.newPage({hasTouch: true, isMobile: true, viewport: {width: 390, height: 844}});
    try {
      await touch.goto(`${server.url}/examples/personal-room/index.html`);
      const object = touch.locator('.object-link svg').first();
      const before = await object.evaluate(element => getComputedStyle(element).transform);
      await touch.locator('.object-link').first().dispatchEvent('mouseover');
      assert.equal(await object.evaluate(element => getComputedStyle(element).transform), before);
    } finally {await touch.close();}
  });
  await check('no script and missing font preserve work and stories', async () => {
    const fallback = await browser.newPage({javaScriptEnabled: false, viewport: {width: 320, height: 844}});
    try {
      await fallback.route('**/*.ttf', route => route.abort());
      await fallback.goto(`${server.url}/examples/personal-room/index.html`); await fallback.evaluate(() => document.fonts.ready);
      assert(!(await fallback.evaluate(() => document.fonts.check('24px Schoolbell'))));
      assert(await fallback.locator('.palette').evaluate(element => element.hidden));
      await fallback.locator('#project-notes summary').click(); assert(await fallback.locator('#project-notes').evaluate(element => element.open));
      const audit = await inspectPage(fallback); assert(!audit.overflow); assert.equal(audit.clippedText.length, 0);
    } finally {await fallback.close();}
  });
  }
  if (surfaces.some(surface => surface.name === 'editorial-calm')) {
  await check('editorial dialog recovers keyboard focus', async () => {
    await page.goto(`${server.url}/examples/index.html`);
    await page.locator('#review').focus(); await page.keyboard.press('Enter');
    assert(await page.locator('#dialog').evaluate(element => element.open));
    assert(await page.locator('#dialog').evaluate(element => element.contains(document.activeElement)));
    await page.keyboard.press('Escape');
    assert(!(await page.locator('#dialog').evaluate(element => element.open)));
    assert.equal(await page.locator(':focus').getAttribute('id'), 'review');
  });
  }
  if (surfaces.some(surface => surface.name === 'repair-notebook')) {
  await check('repair notebook validation, cancel, save and reload', async () => {
    await page.goto(`${server.url}/eval/cycles/12/index.html`);
    await page.locator('#edit').click(); await page.locator('#note-title').fill('');
    await page.locator('button[type="submit"]').click();
    assert.equal(await page.locator('#note-title').getAttribute('aria-invalid'), 'true');
    assert.equal(await page.locator(':focus').getAttribute('id'), 'note-title');
    await page.locator('#cancel').click(); assert.equal(await page.locator(':focus').getAttribute('id'), 'edit');
    assert.equal(await page.locator('#blue-notebook summary').textContent(), 'The blue notebook');
    await page.locator('#edit').click();
    await page.locator('#note-title').fill('A repaired notebook');
    await page.locator('#note-body').fill('A different note, kept in this browser.');
    await page.locator('button[type="submit"]').click();
    assert.match(await page.locator('#feedback').textContent(), /saved in this browser/);
    await page.reload();
    assert.equal(await page.locator('#blue-notebook summary').textContent(), 'A repaired notebook');
    assert.match(await page.locator('#blue-notebook .entry-body').textContent(), /different note/);
    await page.locator('[data-note="loose-spine"]').focus(); await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.activeElement?.matches('#loose-spine summary'));
    assert.equal(await page.locator('[data-note="loose-spine"]').getAttribute('aria-current'), 'true');
  });
  await check('repair notebook failed storage preserves draft', async () => {
    await page.locator('#edit').click(); await page.locator('#note-body').fill('Do not lose this draft.');
    await page.evaluate(() => {Storage.prototype.setItem = () => {throw new Error('Storage unavailable');};});
    await page.locator('button[type="submit"]').click();
    assert.equal(await page.locator('#note-body').inputValue(), 'Do not lose this draft.');
    assert.match(await page.locator('#feedback').textContent(), /draft is still here/);
    assert(await page.locator('#editor').isVisible());
    await page.locator('[data-note="blue-notebook"]').click();
    await page.locator('[data-note="loose-spine"]').click();
    await page.locator('#edit').click();
    assert.equal(await page.locator('#note-body').inputValue(), 'Do not lose this draft.');
  });
  await check('repair notebook without JavaScript remains readable', async () => {
    const fallback = await browser.newPage({javaScriptEnabled: false, viewport: {width: 320, height: 844}});
    try {
      await fallback.goto(`${server.url}/eval/cycles/12/index.html`);
      await fallback.locator('#alba-cover summary').click();
      assert(await fallback.locator('#alba-cover').evaluate(element => element.open));
      assert.match(await fallback.locator('#alba-cover .entry-body').textContent(), /Încet/);
      assert(!(await fallback.locator('#edit').isVisible()));
    } finally {await fallback.close();}
  });
  }
  await page.close();
} catch (error) {
  failures.push({name: 'verification runner', message: error.message});
} finally {
  const sourcePaths = ['scripts/verify-examples.mjs', 'scripts/lib/browser-checks.mjs', 'examples/index.html', 'examples/personal-room/index.html', 'examples/personal-room/style.css', 'examples/personal-room/room.js', 'eval/cycles/12/index.html', 'eval/cycles/12/style.css', 'eval/cycles/12/notebook.js', 'skills/personal-room/assets/tokens.json', 'skills/personal-room/assets/tokens.css', 'skills/personal-room/assets/fonts.css', 'skills/personal-room/assets/fonts/Schoolbell-Regular.ttf', 'skills/editorial-calm/assets/tokens.json', 'skills/editorial-calm/assets/tokens.css', 'skills/editorial-calm/assets/fonts.css', 'skills/editorial-calm/assets/fonts/inter-latin-wght-normal.woff2', 'skills/editorial-calm/assets/fonts/inter-latin-ext-wght-normal.woff2'];
  const sources = Object.fromEntries(await Promise.all(sourcePaths.map(async path => [path, createHash('sha256').update(await readFile(resolve(root, path))).digest('hex')])));
  await writeFile(resolve(output, 'checks.json'), JSON.stringify({generatedAt: new Date().toISOString(), browser: browser?.version(), sources, reports, interactions, failures, limitations: 'Solid-background direct-text contrast only. Images, texture, opacity blending, SVG marks, screen-reader behavior, visual composition and native platforms need separate review. Text enlargement is a synthetic stress test, not full WCAG certification.'}, null, 2) + '\n');
  if (browser) await browser.close();
  await server.close();
}
console.log(JSON.stringify({output, layouts: reports.length, interactions: interactions.length, failures: failures.length}));
if (failures.length) process.exitCode = 1;
