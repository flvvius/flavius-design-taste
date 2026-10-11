import assert from 'node:assert/strict';

export async function installSpecimenFailure(page, mode) {
  assert(['media', 'preview'].includes(mode));
  await page.addInitScript(mode => {
    if (mode === 'media') {
      window.matchMedia = () => {throw new Error('Injected specimen media failure');};
    } else {
      const attach = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, ...options) {
        if (this instanceof HTMLElement && this.id === 'invitation-preview' && type === 'close') {
          throw new Error('Injected specimen preview failure');
        }
        return attach.call(this, type, ...options);
      };
    }
  }, mode);
}

export async function assertSpecimenReading(page) {
  assert.equal(await page.locator('h1').textContent(), 'Room for the work.');
  assert.deepEqual(await page.locator('main section h2').allTextContents(), ['This week', 'Recent work', 'Preferences', 'Invite a collaborator', 'Saved items']);
  assert.deepEqual(await page.locator('.number').allTextContents(), ['12', '3', '84%']);
  assert.deepEqual(await page.locator('article h3').allTextContents(), ['Release notes', 'Account settings']);
  assert.equal(await page.locator('#form input, #form button').count(), 2);
  const controls = await page.locator('#form input, #form button').evaluateAll(elements => elements.map(element => ({name: element.id || element.textContent, disabled: element.disabled, description: element.getAttribute('aria-describedby')})));
  assert(controls.every(control => control.disabled), 'Invitation controls must remain unavailable before initialization');
  assert(controls.every(control => control.description === 'feedback'), 'Unavailable controls need their visible explanation');
  assert.equal(await page.locator('#feedback').textContent(), 'Invitation preview is unavailable in this reading view.');
  assert(await page.locator('#feedback').isVisible());
  assert.equal(await page.locator('#email').inputValue(), '');
  assert(!(await page.locator('#invitation-preview').evaluate(element => element.open)));
  assert(!(await page.locator('#review').isDisabled()));
  const url = page.url();
  await page.locator('#form button').click({force: true});
  assert.equal(page.url(), url, 'Unavailable preview must not navigate');
  assert(!(await page.locator('#invitation-preview').evaluate(element => element.open)));
  await page.locator('#review').focus();
  const tabStops = [];
  for (let index = 0; index < 5; index++) {
    await page.keyboard.press('Tab');
    tabStops.push(await page.evaluate(() => ({id: document.activeElement.id, insideInvitation: !!document.activeElement.closest('#form')})));
  }
  assert(tabStops.every(stop => !stop.insideInvitation), 'Unavailable invitation controls must stay out of keyboard traversal');
  return {controls, explanation: 'Invitation preview is unavailable in this reading view.', tabStops};
}

export async function assertReviewActions(page) {
  const review = page.locator('#review'), dialog = page.locator('#dialog'), close = dialog.getByRole('button', {name: 'Close', exact: true});
  assert.equal(await dialog.getAttribute('aria-labelledby'), 'dialog-title');
  assert.equal(await page.locator('#dialog-title').textContent(), 'Release notes');
  assert.equal(await dialog.locator('p').textContent(), 'The new account settings are ready for review.');
  const capability = await review.evaluate(element => ({associatedTarget: element.commandForElement?.id ?? null, command: element.command ?? null}));
  const timeline = [];
  for (const [activation, dismissal] of [['Enter', 'Escape'], ['Space', 'Close via Enter'], ['Enter', 'Close via click']]) {
    await review.focus(); await page.keyboard.press(activation);
    assert(await dialog.evaluate(element => element.open), 'Review must open its named dialog');
    assert(await close.evaluate(element => element === document.activeElement), 'Review begins on Close');
    await page.locator('#digest').evaluate(element => element.focus());
    assert(await close.evaluate(element => element === document.activeElement), 'Background preference must remain inert');
    const traversal = [];
    for (const key of ['Tab', 'Shift+Tab']) {
      await page.keyboard.press(key);
      const focus = await page.evaluate(() => ({inReview: document.querySelector('#dialog').contains(document.activeElement), hasDocumentFocus: document.hasFocus(), activeTag: document.activeElement.tagName}));
      assert(focus.inReview || (!focus.hasDocumentFocus && focus.activeTag === 'BODY'), 'Review traversal must not focus background content');
      traversal.push({key, ...focus});
    }
    await close.focus();
    if (dismissal === 'Escape') await page.keyboard.press('Escape');
    else if (dismissal === 'Close via Enter') await close.press('Enter');
    else await close.click();
    await page.waitForFunction(() => !document.querySelector('#dialog').open);
    assert(await review.evaluate(element => element === document.activeElement), 'Review dismissal returns focus to its trigger');
    timeline.push({activation, opened: true, initialFocus: 'Close', backgroundInert: true, traversal, dismissal, returnedFocus: 'Review'});
  }
  return {capability, timeline};
}
