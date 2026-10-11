import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium, firefox, webkit} from '@playwright/test';
import {outputs} from '../build.mjs';
import {assertPalette, assertLibraryThemeTransitions} from '../lib/theme-checks.mjs';
import {serve, waitForFonts} from '../lib/browser-checks.mjs';
import {fileURLToPath} from 'node:url';
const engine = {chromium, firefox, webkit}[process.env.TASTE_TEST_BROWSER ?? 'chromium'];
if (!engine) throw new Error('Unknown TASTE_TEST_BROWSER');
const root = fileURLToPath(new URL('../../', import.meta.url));
const tokens = JSON.parse(await readFile(new URL('../../skills/editorial-calm/assets/tokens.json', import.meta.url), 'utf8'));

test('portable palettes follow automatic media and retain legacy manual modes', async () => {
  const browser = await engine.launch(), css = outputs(tokens)['tokens.css'];
  const markup = (attributes, style = css) => `<!doctype html><html ${attributes}><head><style>${style}\nbody{background:var(--background);color:var(--foreground)}</style></head><body>Reading content</body></html>`;
  try {
    for (const system of ['light', 'dark']) for (const [attributes, expected] of [
      ['', 'light'], ['class="dark"', 'dark'], ['data-theme="auto"', system],
      ['data-theme="auto" class="dark"', system], ['data-theme="light"', 'light'], ['data-theme="light" class="dark"', 'light'], ['data-theme="dark"', 'dark'], ['data-theme="dark" class="dark"', 'dark']
    ]) {
      const page = await browser.newPage({javaScriptEnabled: false, colorScheme: system});
      await page.setContent(markup(attributes)); await assertPalette(page, tokens.colors[expected], expected); await page.close();
    }
    const page = await browser.newPage({javaScriptEnabled: false, colorScheme: 'light'});
    await page.setContent(markup('data-theme="auto" class="dark"'));
    await assert.rejects(assertPalette(page, tokens.colors.dark, 'dark'), error => error instanceof assert.AssertionError && error.actual?.background === tokens.colors.light.background);
    await page.setContent(markup('data-theme="auto"'));
    await page.emulateMedia({colorScheme: 'dark'}); await assertPalette(page, tokens.colors.dark, 'dark');
    await page.emulateMedia({colorScheme: 'light'}); await assertPalette(page, tokens.colors.light, 'light');
    const withoutAutomatic = css.replace(/@media \(prefers-color-scheme: (?:light|dark)\) \{[\s\S]*?\n\}/g, '');
    assert.notEqual(withoutAutomatic, css);
    await page.emulateMedia({colorScheme: 'dark'}); await page.setContent(markup('data-theme="auto"', withoutAutomatic));
    await assert.rejects(assertPalette(page, tokens.colors.dark, 'dark'), error => error instanceof assert.AssertionError && error.actual?.background === tokens.colors.light.background);
    await page.setContent(markup('class="dark"', css + '\n:root.dark{color-scheme:light}'));
    await assert.rejects(assertPalette(page, tokens.colors.dark, 'dark'), error => error instanceof assert.AssertionError && /Native color scheme/.test(error.message));
    await page.setContent(markup('class="dark"', css + '\nbody{background:magenta !important}'));
    await assert.rejects(assertPalette(page, tokens.colors.dark, 'dark'), error => error instanceof assert.AssertionError && /Painted palette/.test(error.message));
  } finally {await browser.close();}
});

test('library system changes and explicit choices produce the actual palette', async () => {
  const server = await serve(root), browser = await engine.launch();
  try {
    const page = await browser.newPage({colorScheme: 'light'});
    await page.goto(server.url + '/eval/cycles/04/index.html'); await waitForFonts(page);
    const timeline = await assertLibraryThemeTransitions(page, tokens.colors);
    assert.equal(timeline.length, 8);
    await page.close();
    const source = await readFile(new URL('../../eval/cycles/04/index.html', import.meta.url), 'utf8');
    const override = "if(chosen)document.documentElement.dataset.theme=dark?'dark':'light';";
    assert.equal(source.split(override).length - 1, 1);
    const defective = await browser.newPage({colorScheme: 'light'});
    await defective.route('**/eval/cycles/04/index.html', route => route.fulfill({contentType: 'text/html', body: source.replace(override, '')}));
    await defective.goto(server.url + '/eval/cycles/04/index.html');
    await assert.rejects(assertLibraryThemeTransitions(defective, tokens.colors), error => error instanceof assert.AssertionError && error.actual?.background === tokens.colors.dark.background && error.expected?.background === tokens.colors.light.background);
  } finally {await browser.close(); await server.close();}
});

test('maintained Editorial calm consumers honour automatic and explicit preferences', async () => {
  const {assertButtonThemeTransitions, assertSelectThemeTransitions} = await import('../lib/theme-checks.mjs');
  const server = await serve(root), browser = await engine.launch();
  const targets = [['examples/index.html', 'button'], ['eval/cycles/07/index.html', 'select'], ['eval/cycles/09/index.html', 'select'], ['eval/index.html', 'button']];
  try {
    for (const [path, control] of targets) {
      const reading = await browser.newPage({javaScriptEnabled: false, colorScheme: 'dark'});
      await reading.goto(server.url + '/' + path); await waitForFonts(reading);
      await assertPalette(reading, tokens.colors.dark, 'dark'); assert(await reading.locator('#theme').isDisabled());
      await reading.emulateMedia({colorScheme: 'light'}); await assertPalette(reading, tokens.colors.light, 'light'); await reading.close();
      const page = await browser.newPage({colorScheme: 'light'}), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(server.url + '/' + path); await waitForFonts(page);
      if (control === 'select') await assertSelectThemeTransitions(page, tokens.colors);
      else await assertButtonThemeTransitions(page, tokens.colors, {light: 'Dark theme', dark: 'Light theme'});
      assert.deepEqual(errors, []); await page.close();
    }
    const source = await readFile(new URL('../../eval/cycles/07/index.html', import.meta.url), 'utf8');
    const setting = "  document.documentElement.dataset.theme = el('theme').value === 'system' ? 'auto' : el('theme').value;";
    assert.equal(source.split(setting).length - 1, 1);
    const page = await browser.newPage({colorScheme: 'light'});
    await page.route('**/eval/cycles/07/index.html', route => route.fulfill({contentType: 'text/html', body: source.replace(setting, '')}));
    await page.goto(server.url + '/eval/cycles/07/index.html');
    await assert.rejects(assertSelectThemeTransitions(page, tokens.colors), error => error instanceof assert.AssertionError && error.actual === 'auto' && error.expected === 'light');
  } finally {await browser.close(); await server.close();}
});
