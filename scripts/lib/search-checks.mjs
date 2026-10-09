import assert from 'node:assert/strict';

export const articleTitles = [
  'A cooler summer starts with street trees',
  'The night train returns to the timetable',
  'Who gets space on the high street?',
  'Repair cafés keep everyday objects in use',
  'The library opens its doors after dark',
  'A bus route shaped by its passengers'
];
const climateTitles = [articleTitles[0], articleTitles[3]];

export async function installSearchClock(page) {
  await page.clock.install({time: new Date('2026-10-10T00:00:00Z')});
}

export async function pauseSearchClock(page) {
  await page.clock.pauseAt(new Date('2026-10-10T01:00:00Z'));
}

export async function searchSnapshot(page) {
  return {
    query: await page.locator('#query').inputValue(),
    status: await page.locator('#status').textContent(),
    busy: await page.locator('#content').getAttribute('aria-busy'),
    loading: await page.locator('#loading').isVisible(),
    retry: await page.locator('#retry').isVisible(),
    titles: await page.locator('#results summary').allTextContents()
  };
}

export async function assertSearchState(page, state) {
  const snapshot = await searchSnapshot(page);
  const expected = {
    untouched: {query: '', status: 'Enter a topic, title or author to search the sample library.', busy: 'false', loading: false, retry: false, titles: []},
    loading: {query: 'slow', status: 'Searching for "slow"…', busy: 'true', loading: true, retry: false, titles: []},
    results: {query: 'climate', status: '2 results for "climate".', busy: 'false', loading: false, retry: false, titles: climateTitles},
    empty: {query: 'zxq-no-match', status: 'No results for "zxq-no-match". Try a broader term such as climate or transport.', busy: 'false', loading: false, retry: false, titles: []},
    error: {query: 'error', status: 'Could not search for "error". Retry this search or enter another term.', busy: 'false', loading: false, retry: true, titles: []}
  }[state];
  assert(expected, `Unknown search state: ${state}`);
  assert.deepEqual(snapshot, expected);
  assert.equal(await page.locator('#status').getAttribute('role'), 'status');
  assert(!(await page.locator('#status').evaluate(element => !!element.closest('[aria-busy="true"]'))), 'Status must be outside the busy results');
  return snapshot;
}

export async function setupSearchState(page, state) {
  await pauseSearchClock(page);
  if (state === 'untouched') return;
  const query = {loading: 'slow', results: 'climate', empty: 'zxq-no-match', error: 'error'}[state];
  assert(query, `Unknown search state: ${state}`);
  await page.locator('#query').fill(query);
  await page.locator('#query').press('Enter');
  if (state !== 'loading') await page.clock.runFor(450);
  if (state === 'results') await page.locator('#results summary').first().click();
}

export async function assertSearchTransitions(page) {
  const timeline = [];
  const query = page.locator('#query');
  const record = async name => {const snapshot = await searchSnapshot(page); timeline.push({name, ...snapshot}); return snapshot;};
  const submit = async value => {await query.fill(value); await query.press('Enter');};
  await submit('slow');
  await page.clock.runFor(400);
  await query.fill('climate');
  await page.clock.runFor(299);
  let snapshot = await record('replacement remains in debounce');
  assert.equal(snapshot.status, 'Waiting for your search…'); assert.deepEqual(snapshot.titles, []);
  await page.clock.runFor(1);
  await page.clock.runFor(450);
  await assertSearchState(page, 'results');
  await page.clock.runFor(1800);
  await assertSearchState(page, 'results'); await record('late success cannot replace current results');

  await submit('error'); await page.clock.runFor(100);
  await query.fill('climate'); await page.clock.runFor(350);
  snapshot = await record('late failure cannot replace current loading');
  assert.equal(snapshot.status, 'Searching for "climate"…'); assert.equal(snapshot.busy, 'true'); assert(!snapshot.retry);
  await page.clock.runFor(400); await assertSearchState(page, 'results');
  assert(await query.evaluate(element => element === document.activeElement));

  await submit('slow'); await page.clock.runFor(100);
  await page.locator('#clear').click(); await page.clock.runFor(2000);
  await assertSearchState(page, 'untouched');
  assert(await query.evaluate(element => element === document.activeElement)); await record('clear invalidates pending work');

  await submit('slow'); await query.dispatchEvent('compositionstart', {data: 'cl'});
  await query.evaluate(element => {
    element.value = 'climate';
    element.dispatchEvent(new InputEvent('input', {bubbles: true, data: 'climate', inputType: 'insertCompositionText', isComposing: true}));
  });
  await page.locator('#search').dispatchEvent('submit'); await page.clock.runFor(2000);
  snapshot = await record('composition defers searching and invalidates old work');
  assert.equal(snapshot.status, 'Waiting for your search…'); assert.deepEqual(snapshot.titles, []); assert.equal(snapshot.busy, 'false');
  await query.dispatchEvent('compositionend', {data: 'climate'}); await page.clock.runFor(300); await page.clock.runFor(450);
  await assertSearchState(page, 'results');

  await submit('retry'); await page.clock.runFor(450);
  assert(await page.locator('#retry').isVisible()); await page.locator('#retry').click();
  assert(await query.evaluate(element => element === document.activeElement)); assert(!(await page.locator('#retry').isVisible()));
  await page.clock.runFor(450); snapshot = await record('retry recovers and preserves query focus');
  assert.deepEqual(snapshot.titles, articleTitles); assert.equal(snapshot.status, '6 results for "retry".');
  await submit('error'); await page.clock.runFor(450); await assertSearchState(page, 'error');
  await page.locator('#retry').click(); await page.clock.runFor(450); await assertSearchState(page, 'error');
  assert(await query.evaluate(element => element === document.activeElement)); await record('repeated failure offers another retry');

  await submit('climate'); await page.clock.runFor(450);
  await page.locator('#results summary').first().focus(); await page.keyboard.press('Enter');
  assert(await page.locator('#results details').first().evaluate(element => element.open));
  assert(await page.locator('#results .excerpt').first().isVisible()); await record('keyboard opens a readable result');
  return timeline;
}
