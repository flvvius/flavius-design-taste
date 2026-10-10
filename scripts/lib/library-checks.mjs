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

const records = [
  [1, 'Autumn release plan', 'Document · 8 pages', 'Mara Ionescu', '9 Oct 2026', 'Ready', '2026-10-09'],
  [2, 'Customer interview notes', 'Document · 12 pages', 'Alex Chen', '8 Oct 2026', 'In review', '2026-10-08'],
  [3, 'Search experience specification', 'Document · 6 pages', 'Flavius Cojocaru', '7 Oct 2026', 'Draft', '2026-10-07'],
  [4, 'Content migration checklist', 'Document · 3 pages', 'Mara Ionescu', '6 Oct 2026', 'Ready', '2026-10-06'],
  [5, 'Accessibility review', 'Document · 5 pages', 'Sam Rivera', '5 Oct 2026', 'In review', '2026-10-05'],
  [6, 'Editorial workflow decisions', 'Document · 4 pages', 'Alex Chen', '3 Oct 2026', 'Ready', '2026-10-03'],
  [7, 'Research synthesis and open questions', 'Document · 9 pages', 'Sam Rivera', '2 Oct 2026', 'Draft', '2026-10-02'],
  [8, 'September retrospective', 'Document · 2 pages', 'Flavius Cojocaru', '30 Sept 2026', 'Ready', '2026-09-30']
];
async function assertLibraryRecords(page, expectedRecords) {
  assert.deepEqual(await ids(page), expectedRecords.map(row => row[0]));
  for (const [id, title, format, owner, date, status, isoDate] of expectedRecords) {
    const row = page.locator(`[data-id="${id}"]`);
    assert.equal(await row.locator('.title').textContent(), title);
    assert.equal(await row.locator('.format').textContent(), format);
    const values = await row.locator('[data-label]').allTextContents();
    values[1] = values[1].replace(/\bSept\b/, 'Sep');
    assert.deepEqual(values, [owner, date.replace(/\bSept\b/, 'Sep'), status]);
    assert.deepEqual(await row.locator('[data-label]').evaluateAll(cells => cells.map(cell => cell.dataset.label)), ['Owner', 'Updated', 'Status']);
    assert.equal(await row.locator('time').getAttribute('datetime'), isoDate);
    assert(await row.locator('.title').isVisible());
  }
}

export async function assertLibraryReading(page) {
  await assertLibraryRecords(page, records);
  const headings = await page.locator('thead button').evaluateAll(buttons => buttons.map(button => {
    let opacity = 1; for (let element = button; element; element = element.parentElement) opacity *= Number(getComputedStyle(element).opacity);
    return {label: button.textContent.trim(), opacity};
  }));
  assert(headings.every(heading => heading.opacity === 1), `Reading column labels must retain full opacity: ${JSON.stringify(headings)}`);
  assert.equal(await page.locator('#count').textContent(), '8 active documents');
  assert.equal(await page.locator('#view').inputValue(), 'active');
  const available = await page.locator('button,select,input').evaluateAll(controls => controls.filter(control => !control.disabled).map(control => control.id || control.dataset.sort || control.getAttribute('aria-label')));
  assert.deepEqual(available, [], 'Unavailable controls must remain disabled');
  assert.equal(await page.locator('#rows input:checked').count(), 0);
  assert.equal(await page.locator('#rows tr.selected').count(), 0);
  assert.equal(await page.locator('#help').textContent(), 'Reading view. Sorting, selection and archive actions are unavailable.');
  assert.equal(await page.locator('[data-sort="date"]').locator('..').getAttribute('aria-sort'), 'descending');
  assert.equal(await page.locator('table').getAttribute('aria-label'), 'Documents');
  await page.keyboard.press('Tab');
  assert(await page.locator('body').evaluate(element => document.activeElement === element), 'Disabled controls must not enter the tab sequence');
  return {ids: records.map(row => row[0]), count: '8 active documents', unavailableControls: true, readingOnly: true};
}

export const libraryStates = ['active', 'selected', 'archived', 'archived-selected', 'empty', 'all-archived', 'restored'];
export async function setupLibraryState(page, state) {
  assert(libraryStates.includes(state));
  if (['selected', 'archived', 'archived-selected', 'restored'].includes(state)) {
    for (const id of [1, 4]) await page.locator(`[data-id="${id}"] input`).check();
  }
  if (['archived', 'archived-selected', 'restored'].includes(state)) {
    await page.locator('#bulk').click(); await page.locator('#view').selectOption('archived');
  }
  if (['archived-selected', 'restored'].includes(state)) {
    for (const id of [1, 4]) await page.locator(`[data-id="${id}"] input`).check();
  }
  if (state === 'restored') {await page.locator('#bulk').click(); await page.locator('#view').selectOption('active');}
  if (state === 'empty') await page.locator('#view').selectOption('archived');
  if (state === 'all-archived') {for (const id of records.map(row => row[0])) await page.locator(`[data-id="${id}"] input`).check(); await page.locator('#bulk').click();}
}

export async function assertLibraryState(page, state) {
  const archived = ['archived', 'archived-selected', 'empty'].includes(state);
  const expectedRecords = ['empty', 'all-archived'].includes(state) ? [] : archived ? records.filter(row => [1, 4].includes(row[0])) : records;
  const selectedIds = ['selected', 'archived-selected'].includes(state) ? [1, 4] : [];
  assert.deepEqual(await ids(page), expectedRecords.map(row => row[0]));
  assert.deepEqual(await selection(page), selectedIds);
  await assertLibraryRecords(page, expectedRecords);
  for (const [id] of expectedRecords) {
    const row = page.locator(`[data-id="${id}"]`);
    assert.equal(await row.locator('input').isChecked(), selectedIds.includes(id));
    const target = await row.locator('input').evaluate(element => {
      const rect = element.getBoundingClientRect(), paint = getComputedStyle(element, '::before'), mark = getComputedStyle(element, '::after');
      return {width: rect.width, height: rect.height, paintWidth: parseFloat(paint.width), border: parseFloat(paint.borderTopWidth), mark: mark.content};
    });
    assert(target.width >= 44 && target.height >= 44 && target.paintWidth >= 18 && target.border >= 1, `Checkbox target: ${JSON.stringify(target)}`);
    if (selectedIds.includes(id)) assert(target.mark.includes('✓'));
  }
  assert.deepEqual(await page.locator('#view option').allTextContents(), ['Active', 'Archived']);
  assert.equal(await page.locator('label[for="view"]').textContent(), 'Show documents');
  assert.equal(await page.locator('#view').inputValue(), archived ? 'archived' : 'active');
  assert.equal(await page.locator('#count').textContent(), `${expectedRecords.length} ${archived ? 'archived' : 'active'} documents`);
  assert.equal(await page.locator('#selected').textContent(), `${selectedIds.length} selected`);
  assert.equal(await page.locator('#bulk').textContent(), archived ? 'Restore selected' : 'Archive selected');
  assert.equal(await page.locator('#bulk').isDisabled(), !selectedIds.length);
  for (const selector of ['#all', '#all-mobile']) {
    const control = page.locator(selector);
    assert.equal(await control.isDisabled(), !expectedRecords.length);
    assert.equal(await control.isChecked(), !!selectedIds.length && selectedIds.length === expectedRecords.length);
    assert.equal(await control.evaluate(element => element.indeterminate), !!selectedIds.length && selectedIds.length < expectedRecords.length);
  }
  assert.equal(await page.locator('#undo').isVisible(), ['archived', 'archived-selected', 'all-archived', 'restored'].includes(state));
  assert.equal(await page.locator('#message').textContent(), state === 'all-archived' ? '8 documents archived.' : state === 'restored' ? '2 documents restored.' : ['archived', 'archived-selected'].includes(state) ? '2 documents archived.' : '');
  assert.equal(await page.locator('[data-sort="date"]').locator('..').getAttribute('aria-sort'), 'descending');
  assert.equal(await page.locator('table').getAttribute('aria-label'), 'Documents');
  if (!expectedRecords.length) {
    assert.equal(await page.locator('#rows').textContent(), archived ? 'No archived documents.' : 'No active documents. Restore documents from the archive.');
    const geometry = await page.locator('td.empty').evaluate(element => ({cell: element.getBoundingClientRect().width, rows: element.closest('tbody').getBoundingClientRect().width}));
    assert(geometry.cell >= geometry.rows - 1, `Empty state must span the row: ${JSON.stringify(geometry)}`);
  }
  return {state, ids: expectedRecords.map(row => row[0]), selected: selectedIds, view: archived ? 'archived' : 'active'};
}

export async function assertLibraryPointerTargets(page, {touch = false} = {}) {
  const activate = (x, y) => touch ? page.touchscreen.tap(x, y) : page.mouse.click(x, y);
  const observations = [];
  for (const id of records.map(row => row[0])) {
    const control = page.locator(`[data-id="${id}"] input`);
    await control.scrollIntoViewIfNeeded();
    const rect = await control.boundingBox(); assert(rect && rect.width >= 44 && rect.height >= 44);
    const point = {x: rect.x + 3, y: rect.y + 3};
    const hit = await page.evaluate(({x, y}) => document.elementFromPoint(x, y)?.tagName, point);
    assert.equal(hit, 'INPUT');
    await activate(point.x, point.y);
    assert(await control.isChecked(), `Pointer padding must select document ${id}`);
    assert.deepEqual(await selection(page), [id]);
    await activate(point.x, point.y); assert(!(await control.isChecked()));
    assert.deepEqual(await selection(page), []);
    observations.push({id, width: rect.width, height: rect.height, paddingHit: hit, pointer: touch ? 'touch' : 'mouse'});
  }
  const order = await ids(page);
  await page.locator(`[data-id="${order[0]}"] input`).focus(); await page.keyboard.press('ArrowDown');
  assert(await page.locator(`[data-id="${order[1]}"] input`).evaluate(element => element === document.activeElement));
  await page.keyboard.press('Space'); assert.deepEqual(await selection(page), [order[1]]);
  await page.keyboard.press('ArrowUp'); assert(await page.locator(`[data-id="${order[0]}"] input`).evaluate(element => element === document.activeElement));
  await page.locator(`[data-id="${order[1]}"] input`).uncheck();
  return observations;
}
