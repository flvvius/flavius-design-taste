import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {chromium, firefox, webkit} from '@playwright/test';
import {serve} from '../lib/browser-checks.mjs';
import {assertSpecimenReading, assertReviewActions, installSpecimenFailure} from '../lib/specimen-checks.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const engine = {chromium, firefox, webkit}[process.env.TASTE_TEST_BROWSER ?? 'chromium'];
if (!engine) throw new Error('Unknown TASTE_TEST_BROWSER');
const source = await readFile(new URL('../../examples/index.html', import.meta.url), 'utf8');
const commands = ' commandfor="dialog" command="show-modal"';
assert.equal(source.split(commands).length, 2);

test('native Review survives unavailable scripts while dynamic preview stays unavailable', async () => {
  const server = await serve(root), browser = await engine.launch();
  try {
    for (const mode of ['disabled', 'media', 'preview']) {
      const page = await browser.newPage({javaScriptEnabled: mode !== 'disabled', viewport: {width: 320, height: 960}}), errors = [], documents = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => {if (request.resourceType() === 'document') documents.push(request.url());});
      if (mode !== 'disabled') await installSpecimenFailure(page, mode);
      await page.goto(server.url + '/examples/index.html');
      await assertSpecimenReading(page);
      const review = await assertReviewActions(page);
      assert.equal(review.timeline.length, 3);
      assert.equal(review.capability.associatedTarget, 'dialog');
      assert.deepEqual(errors, mode === 'disabled' ? [] : [`Injected specimen ${mode} failure`]);
      assert.equal(documents.length, 1);
      await page.close();
    }
  } finally {await browser.close(); await server.close();}
});

test('Review JavaScript fallback and initialized invitation preserve native dismissal', async () => {
  const server = await serve(root), browser = await engine.launch();
  try {
    const page = await browser.newPage(), errors = [], documents = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {if (request.resourceType() === 'document') documents.push(request.url());});
    await page.route('**/examples/index.html', route => route.fulfill({contentType: 'text/html', body: source.replace(commands, '')}));
    await page.goto(server.url + '/examples/index.html');
    const review = await assertReviewActions(page);
    assert.equal(review.capability.associatedTarget, null);
    assert(!(await page.locator('#email').isDisabled()));
    assert(!(await page.locator('#form button').isDisabled()));
    assert.equal(await page.locator('#feedback').textContent(), '');
    await page.locator('#email').fill('reader@example.test');
    await page.locator('#form button').press('Enter');
    assert(await page.locator('#invitation-preview').evaluate(element => element.open));
    assert.equal(await page.locator('#preview-recipient').textContent(), 'reader@example.test');
    assert.equal(await page.locator(':focus').getAttribute('id'), 'preview-title');
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => document.querySelector('#feedback').textContent === 'Preview closed. No invitation sent.');
    assert.equal(await page.locator('#email').inputValue(), 'reader@example.test');
    assert(await page.locator('#form button').evaluate(element => element === document.activeElement));
    assert.deepEqual(errors, []); assert.equal(documents.length, 1);
  } finally {await browser.close(); await server.close();}
});

test('reading checks reject enabled preview controls, missing explanation and inert Review', async () => {
  const server = await serve(root), browser = await engine.launch();
  async function mutated(body, {failure, scripted = false, operation = assertSpecimenReading, message} = {}) {
    assert.notEqual(body, source);
    const page = await browser.newPage({javaScriptEnabled: !!failure || scripted}), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    if (failure) await installSpecimenFailure(page, failure);
    await page.route('**/examples/index.html', route => route.fulfill({contentType: 'text/html', body}));
    await page.goto(server.url + '/examples/index.html');
    await assert.rejects(operation(page), error => error instanceof assert.AssertionError && message.test(error.message));
    if (failure) assert.deepEqual(errors, [`Injected specimen ${failure} failure`]);
    else assert.deepEqual(errors, []);
    await page.close();
  }
  try {
    await mutated(source.replace('type="submit" disabled', 'type="submit"'), {message: /must remain unavailable/});
    await mutated(source.replace('Invitation preview is unavailable in this reading view.', ''), {message: /Invitation preview is unavailable/});
    await mutated(source.replace(commands, ''), {operation: assertReviewActions, message: /Review must open/});
    await mutated(source.replace(commands, '').replace('reviewDialog.showModal()', 'reviewDialog.show()'), {scripted: true, operation: assertReviewActions, message: /Background preference must remain inert/});
    await mutated(source.replace("const email=document.querySelector('#email');", "const email=document.querySelector('#email');email.disabled=false;"), {failure: 'preview', message: /must remain unavailable/});
  } finally {await browser.close(); await server.close();}
});
