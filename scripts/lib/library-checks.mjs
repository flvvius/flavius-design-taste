import assert from 'node:assert/strict';

const ids = page => page.locator('#rows tr[data-id]').evaluateAll(rows => rows.map(row => Number(row.dataset.id)));
const selection = page => page.locator('#rows tr.selected').evaluateAll(rows => rows.map(row => Number(row.dataset.id)));
const state = async page => ({ids: await ids(page), selected: await selection(page), sort: await page.locator('#sort').inputValue(), direction: await page.locator('#direction').getAttribute('aria-label')});

export async function assertLibraryFocus(page) {
  const observations = [];
  async function resize(width) {
    await page.setViewportSize({width, height: 960});
    await page.waitForFunction(width => document.querySelector('#all').tabIndex === (width <= 680 ? -1 : 0), width);
  }
  await resize(1440);
  await page.locator('[data-sort="name"]').focus(); await page.keyboard.press('Enter');
  assert.deepEqual(await ids(page), [5, 1, 4, 2, 6, 7, 3, 8]);
  await page.locator('[data-id="1"] input').focus(); await page.keyboard.press('Space');
  const expected = await state(page);
  const cases = [
    ['[data-sort="name"]', 1440, '#sort', 320],
    ['[data-sort="owner"]', 1440, '#sort', 320],
    ['[data-sort="date"]', 1440, '#sort', 320],
    ['[data-sort="status"]', 1440, '#sort', 320],
    ['#all', 1440, '#all-mobile', 320],
    ['#sort', 320, '[data-sort="name"]', 1440],
    ['#direction', 320, '[data-sort="name"]', 1440],
    ['#all-mobile', 320, '#all', 1440],
    ['[data-id="1"] input', 1440, '[data-id="1"] input', 320],
    ['[data-id="1"] input', 320, '[data-id="1"] input', 1440],
    ['#view', 1440, '#view', 320],
    ['#view', 320, '#view', 1440]
  ];
  for (const [source, from, target, to] of cases) {
    await resize(from);
    await page.locator(source).focus(); await page.keyboard.press('Shift');
    await resize(to);
    const focus = await page.locator(target).evaluate(element => {
      const rect = element.getBoundingClientRect(), style = getComputedStyle(element);
      const ancestors = []; for (let parent = element; parent; parent = parent.parentElement) ancestors.push(parent);
      return {focused: element === document.activeElement, outline: parseFloat(style.outlineWidth), visible: element.checkVisibility() && ancestors.every(parent => getComputedStyle(parent).clipPath === 'none'), withinViewport: rect.left >= 0 && rect.top >= 0 && rect.right <= innerWidth && rect.bottom <= innerHeight};
    });
    assert(focus.focused && focus.visible && focus.withinViewport && focus.outline >= 2, `Responsive focus ${source} → ${target}: ${JSON.stringify(focus)}`);
    assert.deepEqual(await state(page), expected, 'Resizing must preserve order and selection');
    observations.push({source, from, target, to, ...focus});
  }
  await resize(320);
  await page.locator('#all-mobile').focus(); await page.keyboard.press('Space');
  assert.equal(await page.locator('#selected').textContent(), '8 selected');
  await resize(1440);
  await page.keyboard.press('Space');
  assert.equal(await page.locator('#selected').textContent(), '0 selected');
  await resize(320);
  await page.locator('#direction').focus(); await page.keyboard.press('Enter');
  assert.equal(await page.locator('[data-sort="name"]').locator('..').getAttribute('aria-sort'), 'descending');
  await resize(1440); await page.keyboard.press('Enter');
  assert.deepEqual(await ids(page), expected.ids);
  await resize(320); await page.locator('#sort').selectOption('owner');
  await resize(1440);
  assert(await page.locator('[data-sort="owner"]').evaluate(element => element === document.activeElement));
  assert.deepEqual(await ids(page), [2, 6, 3, 8, 1, 4, 5, 7]);
  await resize(320); await page.locator('#sort').focus(); await page.locator('#sort').evaluate(element => element.blur());
  await resize(1440);
  assert(await page.locator('body').evaluate(element => element === document.activeElement), 'An explicit blur must not reclaim focus');
  return observations;
}

export async function assertLibraryActions(page) {
  for (const id of [1, 4]) {await page.locator(`[data-id="${id}"] input`).focus(); await page.keyboard.press('Space');}
  assert.equal(await page.locator('#selected').textContent(), '2 selected');
  assert(await page.locator('#all').evaluate(element => element.indeterminate));
  assert(await page.locator('#all-mobile').evaluate(element => element.indeterminate));
  await page.locator('#bulk').focus(); await page.keyboard.press('Enter');
  assert.deepEqual((await ids(page)).sort((a, b) => a - b), [2, 3, 5, 6, 7, 8]);
  assert.equal(await page.locator('#message').textContent(), '2 documents archived.');
  assert(await page.locator('#undo').evaluate(element => element === document.activeElement));
  await page.keyboard.press('Enter');
  assert.deepEqual((await ids(page)).sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert(await page.locator('#view').evaluate(element => element === document.activeElement));
  for (const id of [1, 4]) await page.locator(`[data-id="${id}"] input`).check();
  await page.locator('#bulk').click(); await page.locator('#view').selectOption('archived');
  assert.deepEqual((await ids(page)).sort((a, b) => a - b), [1, 4]);
  await page.locator('#all').check(); await page.locator('#bulk').click();
  assert.equal(await page.locator('#count').textContent(), '0 archived documents');
  assert.equal(await page.locator('#rows').textContent(), 'No archived documents.');
  assert(await page.locator('#all').isDisabled());
  assert(await page.locator('#all-mobile').isDisabled());
  assert(await page.locator('#bulk').isDisabled());
  await page.locator('#undo').click();
  assert.deepEqual((await ids(page)).sort((a, b) => a - b), [1, 4]);
  assert.equal(await page.locator('#selected').textContent(), '0 selected');
  await page.locator('#view').selectOption('active');
  assert.deepEqual((await ids(page)).sort((a, b) => a - b), [2, 3, 5, 6, 7, 8]);
}
