import assert from 'node:assert/strict';
import {chromium, firefox, webkit} from '@playwright/test';
import {mkdir, writeFile, mkdtemp} from 'node:fs/promises';
import {resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {installSearchClock, pauseSearchClock, setupSearchState, assertSearchState, assertSearchTransitions, articleTitles} from './lib/search-checks.mjs';
import {assertLibraryFocus, assertLibraryActions, libraryStates, setupLibraryState, assertLibraryState, assertLibraryPointerTargets, assertLibraryReading} from './lib/library-checks.mjs';
import {assertUsageChart} from './lib/usage-chart-checks.mjs';
import {assertPalette, assertLibraryThemeTransitions, assertButtonThemeTransitions, assertSelectThemeTransitions} from './lib/theme-checks.mjs';
import {captureSources} from './lib/source-snapshot.mjs';
import {serve, enlargeText, applyTextSpacing, inspectPage, waitForFonts, forcedColorSupport, measureHoverTransforms} from './lib/browser-checks.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const argumentsList = process.argv.slice(2);
const engines = {chromium, firefox, webkit};
const browserIndex = argumentsList.indexOf('--browser');
const browserName = browserIndex === -1 ? 'chromium' : argumentsList[browserIndex + 1];
if (!Object.hasOwn(engines, browserName)) throw new Error('--browser requires chromium, firefox or webkit');
const outputIndex = argumentsList.indexOf('--output');
if (outputIndex !== -1 && !argumentsList[outputIndex + 1]) throw new Error('--output requires a directory');
const output = outputIndex === -1 ? await mkdtemp(resolve(tmpdir(), 'taste-browser-')) : resolve(root, argumentsList[outputIndex + 1]);
await mkdir(output, {recursive: true});
let browser;
const reports = [], failures = [], interactions = [], unverified = [];
const capabilities = {};
const requestedSurfaces = argumentsList.flatMap((value, index) => value === '--surface' ? [argumentsList[index + 1]] : []);
const allSurfaces = [
  {name: 'personal-room', path: 'examples/personal-room/index.html', themes: ['paper', 'night'], palette: '[data-palette]', setTheme: async (page, theme) => page.locator(`[data-palette="${theme}"]`).click()},
  {name: 'editorial-calm', path: 'examples/index.html', themes: ['light', 'dark'], setTheme: async (page, theme) => {if (await page.evaluate(() => document.documentElement.classList.contains('dark')) !== (theme === 'dark')) await page.locator('#theme').click();}},
  {name: 'usage-chart', path: 'eval/cycles/07/index.html', themes: ['light', 'dark'], states: ['week', 'month'], setTheme: async (page, theme) => page.locator('#theme').selectOption(theme), setup: async (page, state) => {await page.locator('#period').selectOption(state); await page.locator('details summary').click();}},
  {name: 'article-search', path: 'eval/cycles/09/index.html', themes: ['light', 'dark'], states: ['untouched', 'loading', 'results', 'empty', 'error'], beforeLoad: installSearchClock, setTheme: async (page, theme) => page.locator('#theme').selectOption(theme), setup: setupSearchState},
  {name: 'document-library', path: 'eval/cycles/04/index.html', themes: ['light', 'dark'], states: libraryStates, setTheme: async (page, theme) => {if (await page.evaluate(() => document.documentElement.classList.contains('dark')) !== (theme === 'dark')) await page.locator('#theme').click();}, setup: setupLibraryState},
  {name: 'repair-notebook', path: 'eval/cycles/12/index.html', themes: ['paper', 'night'], setTheme: async (page, theme) => page.locator(`[data-palette="${theme}"]`).click(), setup: async page => page.locator('#edit').click()}
];
for (const name of requestedSurfaces) if (!allSurfaces.some(surface => surface.name === name)) throw new Error(`Unknown surface: ${name}`);
const surfaces = allSurfaces.filter(surface => !requestedSurfaces.length || requestedSurfaces.includes(surface.name));
const variants = [
  {width: 320, mode: 'normal'}, {width: 390, mode: 'normal'}, {width: 768, mode: 'normal'}, {width: 1440, mode: 'normal'},
  {width: 320, mode: 'all-text-200'}, {width: 320, height: 480, mode: 'all-text-200-short'}, {width: 320, mode: 'spacing'},
  {width: 320, mode: 'forced-colors'}, {width: 1440, mode: 'forced-colors'}
];
const sourcePaths = ['scripts/verify-examples.mjs', 'scripts/lib/browser-checks.mjs', 'scripts/lib/theme-checks.mjs', 'scripts/lib/source-snapshot.mjs', 'scripts/lib/usage-chart-checks.mjs', 'scripts/lib/search-checks.mjs', 'scripts/lib/library-checks.mjs', 'eval/cycles/04/index.html', 'eval/cycles/09/index.html', 'eval/cycles/07/index.html', 'package-lock.json', 'examples/index.html', 'eval/index.html', 'examples/personal-room/index.html', 'examples/personal-room/style.css', 'examples/personal-room/room.js', 'eval/cycles/12/index.html', 'eval/cycles/12/style.css', 'eval/cycles/12/notebook.js', 'skills/personal-room/assets/tokens.json', 'skills/personal-room/assets/tokens.css', 'skills/personal-room/assets/fonts.css', 'skills/personal-room/assets/fonts/Schoolbell-Regular.ttf', 'skills/editorial-calm/assets/tokens.json', 'skills/editorial-calm/assets/tokens.css', 'skills/editorial-calm/assets/fonts.css', 'skills/editorial-calm/assets/fonts/inter-latin-wght-normal.woff2', 'skills/editorial-calm/assets/fonts/inter-latin-ext-wght-normal.woff2'];
let server, snapshot, editorialColors;
async function check(name, operation) {
  try {await operation(); interactions.push({name, passed: true});}
  catch (error) {failures.push({name, message: error.message}); interactions.push({name, passed: false, message: error.message});}
}
try {
  snapshot = await captureSources(root, sourcePaths);
  editorialColors = JSON.parse(snapshot.files.get(resolve(root, 'skills/editorial-calm/assets/tokens.json')).toString()).colors;
  server = await serve(root, snapshot.files);
  browser = await engines[browserName].launch();
  capabilities.forcedColors = await forcedColorSupport(browser);
  for (const surface of surfaces) for (const theme of surface.themes) for (const variant of variants) for (const state of surface.states ?? [null]) {
    const page = await browser.newPage({viewport: {width: variant.width, height: variant.height ?? 960}, reducedMotion: 'reduce', forcedColors: variant.mode === 'forced-colors' ? 'active' : 'none'});
    const errors = [], requests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {if (response.status() >= 400) requests.push({url: response.url(), status: response.status()});});
    page.on('requestfailed', request => requests.push({url: request.url(), error: request.failure()?.errorText}));
    if (surface.beforeLoad) await surface.beforeLoad(page);
    const response = await page.goto(`${server.url}/${surface.path}`, {waitUntil: 'networkidle'});
    assert(response?.ok(), `${surface.path} failed to load: ${response?.status()}`);
    await waitForFonts(page);
    await surface.setTheme(page, theme);
    const palette = ['light', 'dark'].includes(theme) ? await assertPalette(page, editorialColors[theme], theme, {forcedColors: variant.mode === 'forced-colors'}) : null;
    if (surface.setup) await surface.setup(page, state);
    if (variant.mode.startsWith('all-text-200')) await enlargeText(page);
    if (variant.mode === 'spacing') await applyTextSpacing(page);
    const audit = await inspectPage(page);
    const name = `${surface.name}-${theme}-${variant.width}-${variant.mode}${state ? '-' + state : ''}`;
    let chart, search, library;
    if (surface.name === 'article-search') await check(`${name} visible search state`, async () => {search = await assertSearchState(page, state);});
    if (surface.name === 'usage-chart') await check(`${name} values, scale and series`, async () => {chart = await assertUsageChart(page, state);});
    if (surface.name === 'document-library') await check(`${name} documents, selection and action state`, async () => {library = await assertLibraryState(page, state);});
    reports.push({name, palette, height: variant.height ?? 960, ...audit, errors, requests, ...(chart ? {chart} : {}), ...(search ? {search} : {}), ...(library ? {library} : {})});
    const issues = audit.overflow || audit.outsideViewport.length || audit.clippedText.length || audit.contrast.length || audit.unlabeled.length || audit.smallTargets.length || audit.clippedTabStops.length || errors.length || requests.length;
    if (issues) failures.push({name, audit, errors, requests});
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({path: resolve(output, `${name}.png`), fullPage: true, animations: 'disabled'});
    if (surface.name === 'editorial-calm') {
      const recipient = 'reader.' + 'a'.repeat(48) + '@' + 'b'.repeat(48) + '.example.com';
      await page.locator('#email').fill(recipient);
      await page.locator('#form button[type="submit"]').focus();
      await page.keyboard.press('Enter');
      assert(await page.locator('#invitation-preview').evaluate(element => element.open));
      assert.equal(await page.locator('#preview-recipient').textContent(), recipient);
      assert.equal(await page.locator(':focus').getAttribute('id'), 'preview-title');
      const previewAudit = await inspectPage(page);
      const previewName = `${name}-invitation-preview`;
      reports.push({name: previewName, height: variant.height ?? 960, ...previewAudit, errors, requests});
      const previewIssues = previewAudit.overflow || previewAudit.outsideViewport.length || previewAudit.clippedText.length || previewAudit.contrast.length || previewAudit.unlabeled.length || previewAudit.smallTargets.length || previewAudit.clippedTabStops.length || errors.length || requests.length;
      if (previewIssues) failures.push({name: previewName, audit: previewAudit, errors, requests});
      const geometry = await page.locator('#invitation-preview').evaluate(element => ({width: element.clientWidth, scrollWidth: element.scrollWidth}));
      assert(geometry.scrollWidth <= geometry.width, JSON.stringify(geometry));
      await page.screenshot({path: resolve(output, `${previewName}.png`), animations: 'disabled'});
      await page.keyboard.press('Tab');
      assert.equal(await page.locator(':focus').textContent(), 'Close preview');
      const target = await page.locator(':focus').boundingBox();
      assert(target && target.y >= 0 && target.y + target.height <= (variant.height ?? 960), JSON.stringify(target));
      await page.keyboard.press('Escape');
      assert(await page.locator('#form button[type="submit"]').evaluate(element => element === document.activeElement));
    }
    await page.close();
  }
  for (const surface of surfaces) {
    await check(`${surface.name} forced-colour media rules and keyboard focus`, async () => {
      const forced = await browser.newPage({forcedColors: 'active', viewport: {width: 320, height: 844}});
      try {
        if (surface.beforeLoad) await surface.beforeLoad(forced);
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
      } finally {await forced.close();}
    });
    const boundaryName = `${surface.name} forced-colour substitution and control boundaries`;
    if (capabilities.forcedColors.colorSubstitution) {
      await check(boundaryName, async () => {
        const forced = await browser.newPage({forcedColors: 'active', viewport: {width: 320, height: 844}});
        try {
          if (surface.beforeLoad) await surface.beforeLoad(forced);
        await forced.goto(`${server.url}/${surface.path}`);
        if (surface.setup) await surface.setup(forced, surface.states?.[0]);
        const boundaries = await forced.locator('button, input, textarea, select').evaluateAll(elements => elements.filter(element => {
          if (!element.getClientRects().length) return false;
          for (let parent = element; parent; parent = parent.parentElement) if (getComputedStyle(parent).clipPath === 'inset(50%)') return false;
          return true;
        }).map(element => {
          const style = getComputedStyle(element, element.matches('input[type="checkbox"]') && getComputedStyle(element, '::before').content !== 'none' ? '::before' : null);
          return {name: element.id || element.textContent.trim(), width: parseFloat(style.borderTopWidth), style: style.borderTopStyle, color: style.borderTopColor, background: style.backgroundColor};
        }));
        assert(boundaries.length);
        assert(boundaries.every(boundary => boundary.width >= 1 && boundary.style !== 'none' && boundary.color !== boundary.background), JSON.stringify(boundaries));
        } finally {await forced.close();}
      });
    } else {
      unverified.push({name: boundaryName, reason: 'The engine matched the media query but did not substitute colours. Media rules and focus were checked separately.'});
    }
  }
  const page = await browser.newPage({viewport: {width: 390, height: 844}});
  if (surfaces.some(surface => surface.name === 'article-search')) {
    await check('article-search stale results, debounce, clear, simulated composition, retry and keyboard reading', async () => {
      const searchPage = await browser.newPage({viewport: {width: 320, height: 960}});
      try {
        await installSearchClock(searchPage);
        await searchPage.goto(`${server.url}/eval/cycles/09/index.html`);
        await pauseSearchClock(searchPage);
        const timeline = await assertSearchTransitions(searchPage);
        await writeFile(resolve(output, 'article-search-transitions.json'), JSON.stringify(timeline, null, 2) + '\n');
      } finally {await searchPage.close();}
    });
    for (const variant of [{width: 320, mode: 'normal'}, {width: 1440, mode: 'normal'}, {width: 320, mode: 'all-text-200-missing-font'}]) {
      await check(`article-search readable library without scripts, ${variant.width}, ${variant.mode}`, async () => {
        const fallback = await browser.newPage({javaScriptEnabled: false, viewport: {width: variant.width, height: 960}});
        try {
          if (variant.mode.endsWith('missing-font')) await fallback.route('**/*.woff2', route => route.abort());
          await fallback.goto(`${server.url}/eval/cycles/09/index.html`); await waitForFonts(fallback);
          assert.deepEqual(await fallback.locator('#results summary').allTextContents(), articleTitles);
          assert.equal(await fallback.locator('#search input:enabled, #search button:enabled, #theme:enabled').count(), 0);
          assert.match(await fallback.locator('#status').textContent(), /Six sample articles are available/);
          assert.equal(await fallback.locator('#help').textContent(), 'Sample data only. Expand an article to read its sample excerpt.');
          if (variant.mode.endsWith('missing-font')) {
            assert(await fallback.evaluate(() => [...document.fonts].some(face => face.status === 'error')));
            await enlargeText(fallback);
          }
          await fallback.locator('#results summary').first().focus(); await fallback.keyboard.press('Enter');
          assert(await fallback.locator('#results .excerpt').first().isVisible());
          const audit = await inspectPage(fallback);
          assert(!audit.overflow && !audit.outsideViewport.length && !audit.clippedText.length && !audit.contrast.length && !audit.unlabeled.length && !audit.smallTargets.length, JSON.stringify(audit));
          const name = `article-search-no-script-${variant.width}-${variant.mode}`;
          reports.push({name, height: 960, ...audit});
          await fallback.screenshot({path: resolve(output, `${name}.png`), fullPage: true, animations: 'disabled'});
        } finally {await fallback.close();}
      });
    }
  }
  if (surfaces.some(surface => surface.name === 'usage-chart')) {
    for (const variant of [{width: 320, mode: 'normal'}, {width: 1440, mode: 'normal'}, {width: 320, mode: 'all-text-200-missing-font'}, {width: 320, mode: 'spacing'}, {width: 320, mode: 'forced-colors'}]) {
      await check(`usage-chart default week without scripts, ${variant.width}, ${variant.mode}`, async () => {
        const fallback = await browser.newPage({javaScriptEnabled: false, viewport: {width: variant.width, height: 960}, forcedColors: variant.mode === 'forced-colors' ? 'active' : 'none'});
        try {
          if (variant.mode.endsWith('missing-font')) await fallback.route('**/*.woff2', route => route.abort());
          await fallback.goto(`${server.url}/eval/cycles/07/index.html`);
          await waitForFonts(fallback);
          assert(await fallback.locator('#period').isDisabled());
          assert(await fallback.locator('#theme').isDisabled());
          assert.equal(await fallback.locator('#theme').inputValue(), 'system');
          assert.equal(await fallback.locator('html').getAttribute('data-theme'), 'auto');
          if (variant.mode.endsWith('missing-font')) {
            assert(await fallback.evaluate(() => [...document.fonts].some(face => face.status === 'error')));
            await enlargeText(fallback);
          }
          if (variant.mode === 'spacing') await applyTextSpacing(fallback);
          await fallback.locator('details summary').click();
          const chart = await assertUsageChart(fallback, 'week');
          const audit = await inspectPage(fallback);
          assert(!audit.overflow && !audit.outsideViewport.length && !audit.clippedText.length && !audit.contrast.length && !audit.unlabeled.length && !audit.smallTargets.length, JSON.stringify(audit));
          const name = `usage-chart-no-script-${variant.width}-${variant.mode}`;
          reports.push({name, height: 960, ...audit, chart});
          await fallback.screenshot({path: resolve(output, `${name}.png`), fullPage: true, animations: 'disabled'});
        } finally {await fallback.close();}
      });
    }
    await check('usage-chart live resizing preserves the period and exposes one values view', async () => {
      await page.goto(`${server.url}/eval/cycles/07/index.html`);
      await page.locator('details summary').click();
      await page.locator('#period').selectOption('month');
      const snapshots = [];
      for (const width of [320, 1440, 320]) {
        await page.setViewportSize({width, height: 960});
        await assertUsageChart(page, 'month');
        const details = page.locator('details');
        assert.equal(await details.getByRole('table').count(), width > 600 ? 1 : 0);
        assert.equal(await details.getByRole('term').count(), width <= 600 ? 8 : 0);
        assert.equal(await details.getByRole('definition').count(), width <= 600 ? 8 : 0);
        snapshots.push({width, snapshot: await details.ariaSnapshot()});
        const audit = await inspectPage(page);
        assert(!audit.overflow && !audit.clippedText.length && !audit.outsideViewport.length, JSON.stringify(audit));
        assert.equal(await page.locator('#period').inputValue(), 'month');
      }
      await writeFile(resolve(output, 'usage-chart-resize-semantics.json'), JSON.stringify(snapshots, null, 2) + '\n');
      await page.setViewportSize({width: 390, height: 844});
    });
    await check('usage-chart repeated period changes preserve exact values and focus', async () => {
      await page.goto(`${server.url}/eval/cycles/07/index.html`);
      await page.locator('details summary').click();
      await page.locator('#period').focus();
      for (const period of ['month', 'week', 'month']) {
        await page.locator('#period').selectOption(period);
        await assertUsageChart(page, period);
        assert.equal(await page.locator(':focus').getAttribute('id'), 'period');
      }
    });
  }
  if (surfaces.some(surface => surface.name === 'personal-room')) {
  await page.goto(`${server.url}/examples/personal-room/index.html`);
  await check('font loads', async () => {await waitForFonts(page); assert(await page.evaluate(() => [...document.fonts].some(face => face.family.replace(/["']/g, '') === 'Schoolbell' && face.status === 'loaded')));});
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
    await page.goto(`${server.url}/examples/personal-room/index.html`); await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
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
  await check('coarse-pointer hover does not lift objects', async () => {
    const touch = await browser.newPage({hasTouch: true, viewport: {width: 390, height: 844}});
    try {
      await touch.goto(`${server.url}/examples/personal-room/index.html`);
      assert(await touch.evaluate(() => matchMedia('(pointer: coarse)').matches && matchMedia('(hover: none)').matches));
      const motion = await measureHoverTransforms(touch, '.object-link', '.object-link svg');
      assert(motion.hovered);
      assert.equal(motion.after, motion.before);
    } finally {await touch.close();}
  });
  await check('no script and missing font preserve work and stories', async () => {
    const fallback = await browser.newPage({javaScriptEnabled: false, viewport: {width: 320, height: 844}});
    try {
      await fallback.route('**/*.ttf', route => route.abort());
      await fallback.goto(`${server.url}/examples/personal-room/index.html`); await waitForFonts(fallback);
      assert(await fallback.evaluate(() => [...document.fonts].some(face => face.family.replace(/["']/g, '') === 'Schoolbell' && face.status === 'error')));
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
  await check('editorial invitation validation, current recipient, repeat preview and focus recovery', async () => {
    await page.goto(`${server.url}/examples/index.html`);
    const email = page.locator('#email'), trigger = page.locator('#form button[type="submit"]'), preview = page.locator('#invitation-preview');
    for (const invalid of ['', 'not-an-address']) {
      await email.fill(invalid); await trigger.click();
      assert(!(await preview.evaluate(element => element.open)));
      assert(await email.evaluate(element => !element.validity.valid && element === document.activeElement));
      assert.equal(await page.locator('#feedback').textContent(), '');
    }
    await email.fill('reader@example.com'); await trigger.focus(); await page.keyboard.press('Enter');
    assert(await preview.evaluate(element => element.open));
    assert.equal(await page.locator('#preview-recipient').textContent(), 'reader@example.com');
    assert.equal(await page.locator(':focus').getAttribute('id'), 'preview-title');
    await email.evaluate(element => element.focus());
    assert(await preview.evaluate(element => element.contains(document.activeElement)), 'Background input must be inert');
    await page.keyboard.press('Escape');
    assert(await trigger.evaluate(element => element === document.activeElement));
    assert.equal(await email.inputValue(), 'reader@example.com');
    await page.waitForFunction(() => document.querySelector('#feedback').textContent.includes('Preview closed'));
    assert.match(await page.locator('#feedback').textContent(), /Preview closed/);
    await email.fill('another@example.com');
    assert.equal(await page.locator('#feedback').textContent(), '');
    await email.press('Enter');
    assert.equal(await page.locator('#preview-recipient').textContent(), 'another@example.com');
    await preview.getByRole('button', {name: 'Close preview'}).click();
    assert(!(await preview.evaluate(element => element.open)));
    assert(await email.evaluate(element => element === document.activeElement));
    assert.equal(await email.inputValue(), 'another@example.com');
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
  if (surfaces.some(surface => surface.name === 'document-library')) {
    for (const theme of ['light', 'dark']) await check(`document library ${theme} missing font at enlarged text`, async () => {
      const fallback = await browser.newPage({viewport: {width: 320, height: 960}});
      try {
        await fallback.route('**/*.woff2', route => route.abort());
        await fallback.goto(`${server.url}/eval/cycles/04/index.html`); await waitForFonts(fallback);
        assert(await fallback.evaluate(() => [...document.fonts].some(face => face.status === 'error')));
        if (await fallback.evaluate(() => document.documentElement.classList.contains('dark')) !== (theme === 'dark')) await fallback.locator('#theme').click();
        await enlargeText(fallback); const library = await assertLibraryState(fallback, 'active');
        const audit = await inspectPage(fallback), name = `document-library-${theme}-missing-font-320-all-text-200`;
        reports.push({name, height: 960, ...audit, library, expectedFontFailure: true});
        await fallback.screenshot({path: resolve(output, `${name}.png`), fullPage: true, animations: 'disabled'});
        assert(!audit.overflow && !audit.outsideViewport.length && !audit.clippedText.length && !audit.contrast.length && !audit.unlabeled.length && !audit.smallTargets.length && !audit.clippedTabStops.length, JSON.stringify(audit));
      } finally {await fallback.close();}
    });
    const readingVariants = [
      {width: 320, setting: 'normal'}, {width: 1440, setting: 'normal'},
      {width: 320, setting: 'all-text-200'}, {width: 320, setting: 'spacing'},
      {width: 320, setting: 'missing-font-all-text-200'}
    ];
    const initializationFaults = {
      media: {script: "window.matchMedia=()=>{throw new Error('Injected media initialization failure')};", error: 'Injected media initialization failure'},
      date: {script: "const Format=Intl.DateTimeFormat;let calls=0;Intl.DateTimeFormat=function(...args){if(++calls===2)throw new Error('Injected date formatter failure');return new Format(...args)};", error: 'Injected date formatter failure'}
    };
    for (const mode of ['disabled', 'media', 'date']) for (const scheme of ['light', 'dark']) for (const variant of readingVariants) {
      const name = `document-library-reading-${mode}-${scheme}-${variant.width}-${variant.setting}`;
      await check(name, async () => {
        const fallback = await browser.newPage({javaScriptEnabled: mode !== 'disabled', colorScheme: scheme, viewport: {width: variant.width, height: 960}});
        const errors = []; fallback.on('pageerror', error => errors.push(error.message));
        try {
          if (initializationFaults[mode]) await fallback.addInitScript(initializationFaults[mode].script);
          const missingFont = variant.setting.startsWith('missing-font');
          if (missingFont) await fallback.route('**/*.woff2', route => route.abort());
          await fallback.goto(`${server.url}/eval/cycles/04/index.html`); await waitForFonts(fallback);
          if (missingFont) assert(await fallback.evaluate(() => [...document.fonts].some(face => face.status === 'error')));
          if (variant.setting.endsWith('all-text-200')) await enlargeText(fallback);
          if (variant.setting === 'spacing') await applyTextSpacing(fallback);
          const audit = await inspectPage(fallback);
          const report = {name, height: 960, ...audit, javaScriptEnabled: mode !== 'disabled', pageErrors: errors, expectedInitializationFailure: initializationFaults[mode]?.error ?? null, expectedFontFailure: missingFont};
          reports.push(report);
          await fallback.screenshot({path: resolve(output, `${name}.png`), fullPage: true, animations: 'disabled'});
          assert.deepEqual(errors, initializationFaults[mode] ? [initializationFaults[mode].error] : []);
          report.reading = await assertLibraryReading(fallback);
          report.palette = await assertPalette(fallback, editorialColors[scheme], scheme);
          assert(!audit.overflow && !audit.outsideViewport.length && !audit.clippedText.length && !audit.contrast.length && !audit.unlabeled.length && !audit.smallTargets.length && !audit.clippedTabStops.length, JSON.stringify(audit));
        } finally {await fallback.close();}
      });
    }
    for (const mode of ['disabled', 'media', 'date']) await check(`document library ${mode} live reading preference`, async () => {
      const fallback = await browser.newPage({javaScriptEnabled: mode !== 'disabled', colorScheme: 'light', viewport: {width: 320, height: 960}});
      const errors = []; fallback.on('pageerror', error => errors.push(error.message));
      try {
        if (initializationFaults[mode]) await fallback.addInitScript(initializationFaults[mode].script);
        await fallback.goto(`${server.url}/eval/cycles/04/index.html`); await waitForFonts(fallback);
        const timeline = [];
        for (const scheme of ['light', 'dark', 'light']) {
          await fallback.emulateMedia({colorScheme: scheme});
          const palette = await assertPalette(fallback, editorialColors[scheme], scheme);
          const reading = await assertLibraryReading(fallback);
          timeline.push({systemPreference: scheme, palette, reading});
        }
        assert.deepEqual(errors, initializationFaults[mode] ? [initializationFaults[mode].error] : []);
        await writeFile(resolve(output, `document-library-reading-${mode}-preferences.json`), JSON.stringify(timeline, null, 2) + '\n');
      } finally {await fallback.close();}
    });
    await check('document library automatic and explicit themes', async () => {
      const themed = await browser.newPage({colorScheme: 'light', viewport: {width: 320, height: 960}});
      try {
        await themed.goto(`${server.url}/eval/cycles/04/index.html`); await waitForFonts(themed);
        const timeline = await assertLibraryThemeTransitions(themed, editorialColors);
        await writeFile(resolve(output, 'document-library-theme-transitions.json'), JSON.stringify(timeline, null, 2) + '\n');
      } finally {await themed.close();}
    });
    await check('document library coarse-pointer padding and row navigation', async () => {
      const touch = await browser.newPage({viewport: {width: 320, height: 960}, hasTouch: true});
      try {
        await touch.goto(`${server.url}/eval/cycles/04/index.html`); await waitForFonts(touch);
        assert(await touch.evaluate(() => matchMedia('(pointer:coarse)').matches));
        const targets = await assertLibraryPointerTargets(touch, {touch: true});
        await assertLibraryState(touch, 'active');
        await writeFile(resolve(output, 'document-library-touch.json'), JSON.stringify(targets, null, 2) + '\n');
      } finally {await touch.close();}
    });
    for (const theme of ['light', 'dark']) await check(`document library ${theme} responsive focus and archive history`, async () => {
      const library = await browser.newPage({viewport: {width: 1440, height: 960}, reducedMotion: 'reduce'});
      try {
        const errors = []; library.on('pageerror', error => errors.push(error.message));
        await library.goto(`${server.url}/eval/cycles/04/index.html`); await waitForFonts(library);
        if (await library.evaluate(() => document.documentElement.classList.contains('dark')) !== (theme === 'dark')) await library.locator('#theme').click();
        const focus = await assertLibraryFocus(library);
        await writeFile(resolve(output, `document-library-${theme}-focus.json`), JSON.stringify(focus, null, 2) + '\n');
        await library.setViewportSize({width: 320, height: 960}); await library.locator('#sort').focus();
        await library.keyboard.press('Shift');
        assert(await library.locator('#sort').evaluate(element => element === document.activeElement && parseFloat(getComputedStyle(element).outlineWidth) >= 2));
        await library.screenshot({path: resolve(output, `document-library-${theme}-narrow-focus.png`), animations: 'disabled'});
        await library.setViewportSize({width: 1440, height: 960});
        await library.waitForFunction(() => document.querySelector('#all').tabIndex === 0);
        const targets = await assertLibraryPointerTargets(library);
        await writeFile(resolve(output, `document-library-${theme}-pointer.json`), JSON.stringify(targets, null, 2) + '\n');
        await assertLibraryActions(library);
        assert.deepEqual(errors, []);
      } finally {await library.close();}
    });
  }
  const editorialConsumers = [
    {name: 'editorial-calm', path: 'examples/index.html', control: 'button'},
    {name: 'usage-chart', path: 'eval/cycles/07/index.html', control: 'select'},
    {name: 'article-search', path: 'eval/cycles/09/index.html', control: 'select'},
    {name: 'evaluation-gallery', path: 'eval/index.html', control: 'button'}
  ].filter(consumer => consumer.name === 'evaluation-gallery' ? !requestedSurfaces.length : surfaces.some(surface => surface.name === consumer.name));
  for (const consumer of editorialConsumers) {
    for (const scheme of ['light', 'dark']) await check(`${consumer.name} ${scheme} automatic reading palette`, async () => {
      const reading = await browser.newPage({javaScriptEnabled: false, colorScheme: scheme, viewport: {width: 320, height: 960}});
      try {
        await reading.goto(`${server.url}/${consumer.path}`); await waitForFonts(reading);
        const name = `${consumer.name}-reading-${scheme}-320`, audit = await inspectPage(reading);
        const report = {name, height: 960, ...audit, javaScriptEnabled: false}; reports.push(report);
        await reading.screenshot({path: resolve(output, `${name}.png`), fullPage: true, animations: 'disabled'});
        report.palette = await assertPalette(reading, editorialColors[scheme], scheme);
        assert(await reading.locator('#theme').isDisabled());
        assert(!audit.overflow && !audit.outsideViewport.length && !audit.clippedText.length && !audit.contrast.length && !audit.unlabeled.length && !audit.smallTargets.length && !audit.clippedTabStops.length, JSON.stringify(audit));
      } finally {await reading.close();}
    });
    await check(`${consumer.name} automatic and explicit theme transitions`, async () => {
      const themed = await browser.newPage({colorScheme: 'light', viewport: {width: 320, height: 960}}), errors = [];
      themed.on('pageerror', error => errors.push(error.message));
      try {
        await themed.goto(`${server.url}/${consumer.path}`); await waitForFonts(themed);
        const timeline = consumer.control === 'select'
          ? await assertSelectThemeTransitions(themed, editorialColors)
          : await assertButtonThemeTransitions(themed, editorialColors, {light: 'Dark theme', dark: 'Light theme'});
        assert.deepEqual(errors, []);
        await writeFile(resolve(output, `${consumer.name}-theme-transitions.json`), JSON.stringify(timeline, null, 2) + '\n');
      } finally {await themed.close();}
    });
  }
  await page.close();
} catch (error) {
  failures.push({name: 'verification runner', message: error.message});
} finally {
  await writeFile(resolve(output, 'checks.json'), JSON.stringify({generatedAt: new Date().toISOString(), engine: browserName, browser: browser?.version(), node: process.version, sourceMode: 'captured bytes served throughout the run', sources: snapshot?.hashes ?? {}, capabilities, reports, interactions, unverified, failures, limitations: 'Solid-background direct-text contrast only. Images, texture, opacity blending, SVG marks, screen-reader behavior, visual composition and native platforms need separate review. Text enlargement is a synthetic stress test, not full WCAG certification.'}, null, 2) + '\n');
  if (browser) await browser.close();
  if (server) await server.close();
}
console.log(JSON.stringify({output, engine: browserName, layouts: reports.length, interactions: interactions.length, unverified: unverified.length, failures: failures.length}));
if (failures.length) process.exitCode = 1;
