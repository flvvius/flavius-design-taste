import assert from 'node:assert/strict';

const expected = {
  week: {total: '1,120', prior: '970', change: '+15.5%', maximum: 300, current: [142, 88, 76, 184, 210, 196, 224], previous: [126, 80, 72, 154, 168, 180, 190], labels: ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'], peak: '8 Oct', dates: ['2 Oct', '3 Oct', '4 Oct', '5 Oct', '6 Oct', '7 Oct', '8 Oct'], previousDates: ['25 Sep', '26 Sep', '27 Sep', '28 Sep', '29 Sep', '30 Sep', '1 Oct']},
  month: {total: '3,794', prior: '3,288', change: '+15.4%', maximum: 1200, current: [810, 894, 970, 1120], previous: [740, 812, 836, 900], labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], peak: '2–8 Oct', dates: ['11–17 Sep', '18–24 Sep', '25 Sep–1 Oct', '2–8 Oct'], previousDates: ['14–20 Aug', '21–27 Aug', '28 Aug–3 Sep', '4–10 Sep']}
};

export async function assertUsageChart(page, period) {
  const data = expected[period];
  assert(data, `Unknown chart period: ${period}`);
  for (const id of ['total', 'prior', 'change']) assert.equal(await page.locator('#' + id).textContent(), data[id]);
  assert.equal((await page.locator('#maximum').textContent()).replaceAll(',', ''), String(data.maximum));
  assert.match(await page.locator('#summary').textContent(), new RegExp(data.peak));
  assert.deepEqual(await page.locator('.day').allTextContents(), data.labels);
  const rows = await page.locator('#rows tr').evaluateAll(rows => rows.map(row => [...row.querySelectorAll('td')].map(cell => Number(cell.textContent.replaceAll(',', '')))));
  assert.deepEqual(rows, data.current.map((value, index) => [value, data.previous[index]]));
  const tableDates = await page.locator('#rows tr th').evaluateAll(cells => cells.map(cell => [cell.firstChild.textContent, cell.querySelector('.muted').textContent.replace(/^vs /, '')]));
  assert.deepEqual(tableDates, data.dates.map((date, index) => [date, data.previousDates[index]]));
  const pairs = await page.locator('.count-bucket').evaluateAll(buckets => buckets.map(bucket => ({label: bucket.querySelector('h3').textContent, series: [...bucket.querySelectorAll('dl > div')].map(row => ({name: row.querySelector('.series-name').textContent, date: row.querySelector('.count-date').textContent, value: Number(row.querySelector('dd').textContent.replaceAll(',', ''))}))})));
  assert.deepEqual(pairs, data.labels.map((label, index) => ({label, series: [{name: 'Selected', date: data.dates[index], value: data.current[index]}, {name: 'Previous', date: data.previousDates[index], value: data.previous[index]}]})));
  const narrow = page.viewportSize().width <= 600;
  assert.equal(await page.locator('#counts-list').isVisible(), narrow, 'The narrow values must be available only in their reading layout');
  assert.equal(await page.locator('.counts-table').isVisible(), !narrow, 'Only one exact-value representation should be visible');
  const wordFragments = await page.locator('.series-name, .count-bucket dd, thead th, tbody td').evaluateAll(elements => elements.filter(element => element.getClientRects().length).flatMap(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    const lines = new Set([...range.getClientRects()].map(rect => Math.round(rect.top)));
    return lines.size > 1 ? [{text: element.textContent, lines: lines.size}] : [];
  }));
  assert.equal(wordFragments.length, 0, `Value labels and numbers must stay intact: ${JSON.stringify(wordFragments)}`);
  const accessible = await page.locator('#chart').getAttribute('aria-label');
  data.labels.forEach((label, index) => assert(accessible.includes(`${label}: selected ${data.current[index]}, previous ${data.previous[index]}`)));
  const result = await page.evaluate(() => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', {willReadFrequently: true});
    const rgb = color => {context.clearRect(0, 0, 1, 1); context.fillStyle = color; context.fillRect(0, 0, 1, 1); return [...context.getImageData(0, 0, 1, 1).data];};
    const luminance = color => color.slice(0, 3).map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
    const ratio = (a, b) => {const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);};
    const backdrop = element => {for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {const color = rgb(getComputedStyle(ancestor).backgroundColor); if (color[3] === 255) return color;} return [255, 255, 255, 255];};
    const horizontal = matchMedia('(max-width: 600px)').matches;
    const buckets = [...document.querySelectorAll('.bucket')].map(bucket => {
      const pair = bucket.querySelector('.pair'), bounds = pair.getBoundingClientRect(), style = getComputedStyle(pair);
      const extent = horizontal ? bounds.width - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth) : bounds.height - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth);
      return [...bucket.querySelectorAll('.bar')].map(bar => {const b = bar.getBoundingClientRect(); return {fraction: (horizontal ? b.width : b.height) / extent, baseline: horizontal ? b.left : b.bottom};});
    });
    const marks = [...document.querySelectorAll('.bar,.key')].map(element => {
      const style = getComputedStyle(element), previous = element.classList.contains('previous');
      return {class: element.className, image: style.backgroundImage, contrast: ratio(rgb(previous ? style.borderTopColor : style.backgroundColor), backdrop(element))};
    });
    const maximum = document.querySelector('#maximum').getBoundingClientRect(), zero = document.querySelector('.scale span:last-child').getBoundingClientRect();
    return {horizontal, buckets, marks, axisCorrect: horizontal ? zero.left < maximum.left : maximum.top < zero.top};
  });
  assert(result.axisCorrect, 'Zero and maximum must match the value axis');
  result.buckets.forEach((pair, index) => {
    assert(Math.abs(pair[0].baseline - pair[1].baseline) < 1, 'Series must share a zero baseline');
    for (let series = 0; series < 2; series++) assert(Math.abs(pair[series].fraction - [data.current, data.previous][series][index] / data.maximum) < .012, `Bucket ${index}, series ${series} must use the common scale`);
  });
  assert(result.marks.every(mark => mark.contrast >= 3), JSON.stringify(result.marks));
  assert(result.marks.every(mark => mark.class.includes('previous') ? mark.image.includes('repeating-linear-gradient') : mark.image === 'none'), 'Solid and striped identification must survive colour replacement');
  return result;
}
