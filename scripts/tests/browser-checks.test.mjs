import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium, firefox, webkit} from '@playwright/test';
const engines = {chromium, firefox, webkit};
const engine = engines[process.env.TASTE_TEST_BROWSER ?? 'chromium'];
if (!engine) throw new Error('Unknown TASTE_TEST_BROWSER');
import {serve, enlargeText, inspectPage, waitForFonts, measureHoverTransforms} from '../lib/browser-checks.mjs';
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
  const browser = await engine.launch();
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

test('settled missing-font state returns with scripts disabled and content remains readable', async () => {
  const root = await mkdtemp(join(tmpdir(), 'taste-font-state-'));
  await writeFile(join(root, 'index.html'), '<style>@font-face{font-family:Fixture;src:url(missing.ttf)}p{font-family:Fixture,serif}</style><p>Keep this readable</p>');
  const server = await serve(root), browser = await engine.launch();
  try {
    const page = await browser.newPage({javaScriptEnabled: false});
    await page.route('**/*.ttf', route => route.abort());
    await page.goto(server.url);
    await page.locator('p').boundingBox();
    await waitForFonts(page);
    assert(await page.evaluate(() => [...document.fonts].some(face => face.status === 'error')));
    assert.equal(await page.locator('p').textContent(), 'Keep this readable');
    assert(await page.locator('p').isVisible());
  } finally {await browser.close(); await server.close(); await rm(root, {recursive: true});}
});

test('coarse-pointer motion check activates hover and detects an ungated lift', async () => {
  const browser = await engine.launch();
  try {
    const page = await browser.newPage({hasTouch: true});
    await page.setContent('<style>.link{display:block;width:100px;height:100px}.object{width:80px;height:80px;transform:rotate(-2deg);transition:transform 80ms}@media(hover:hover) and (pointer:fine){.link:hover .object{transform:translateY(-10px)}}</style><a href="#" class="link"><div class="object">Object</div></a>');
    assert(await page.evaluate(() => matchMedia('(pointer:coarse)').matches));
    const guarded = await measureHoverTransforms(page, '.link', '.object');
    assert(guarded.hovered);
    assert.equal(guarded.after, guarded.before);
    await page.mouse.move(300, 300);
    await page.addStyleTag({content: '.link:hover .object{transform:translateY(-10px)}'});
    const defective = await measureHoverTransforms(page, '.link', '.object');
    assert(defective.hovered);
    assert.notEqual(defective.after, defective.before);
  } finally {await browser.close();}
});

test('text spacing installs and measures correctly with page scripts disabled', async () => {
  const browser = await engine.launch();
  try {
    const page = await browser.newPage({javaScriptEnabled: false});
    await page.setContent('<style>body{font-size:20px}</style><p>Readable spacing</p>');
    const {applyTextSpacing} = await import('../lib/browser-checks.mjs');
    await applyTextSpacing(page);
    const actual = await page.locator('p').evaluate(element => {
      const style = getComputedStyle(element);
      return {line: style.lineHeight, letter: style.letterSpacing, word: style.wordSpacing, paragraph: style.marginBlockEnd};
    });
    assert.deepEqual(actual, {line: '30px', letter: '2.4px', word: '3.2px', paragraph: '40px'});
  } finally {await browser.close();}
});
