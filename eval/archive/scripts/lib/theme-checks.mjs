import assert from 'node:assert/strict';

export async function assertPalette(page, roles, scheme, {forcedColors = false} = {}) {
  const observation = await page.evaluate(roles => {
    const rootStyle = getComputedStyle(document.documentElement), bodyStyle = getComputedStyle(document.body);
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden';
    probe.style.backgroundColor = roles.background; probe.style.color = roles.foreground;
    document.body.append(probe);
    const expected = getComputedStyle(probe);
    const result = {
      roles: Object.fromEntries(Object.keys(roles).map(role => [role, rootStyle.getPropertyValue('--' + role).trim()])),
      colorScheme: rootStyle.colorScheme,
      painted: {background: bodyStyle.backgroundColor, foreground: bodyStyle.color},
      expectedPaint: {background: expected.backgroundColor, foreground: expected.color},
      supported: CSS.supports('color', roles.background) && CSS.supports('color', roles.foreground)
    };
    probe.remove(); return result;
  }, roles);
  assert(observation.supported, 'Palette colours must be supported before comparing their paint');
  assert.deepEqual(observation.roles, roles, 'Palette role values');
  if (!forcedColors) {
    assert.equal(observation.colorScheme, scheme, 'Native color scheme');
    assert.deepEqual(observation.painted, observation.expectedPaint, 'Painted palette');
  }
  return {scheme, roles: observation.roles, painted: observation.painted, checks: {roles: true, pageColoursAndNativeScheme: !forcedColors}};
}

export async function assertButtonThemeTransitions(page, colors, labels = {light: 'Dark mode', dark: 'Light mode'}) {
  const observations = [];
  async function record(name, scheme, mode) {
    const palette = await assertPalette(page, colors[mode], mode);
    const theme = await page.locator('#theme').evaluate(button => ({label: button.textContent, pressed: button.getAttribute('aria-pressed'), mode: document.documentElement.dataset.theme}));
    assert.equal(theme.label, labels[mode]);
    assert.equal(theme.pressed, String(mode === 'dark'));
    assert.equal(theme.mode, name.startsWith('automatic') ? 'auto' : mode);
    observations.push({name, systemPreference: scheme, ...palette, ...theme});
  }
  async function preference(scheme) {
    await page.emulateMedia({colorScheme: scheme});
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  }
  await preference('light'); await record('automatic light', 'light', 'light');
  await preference('dark'); await record('automatic dark', 'dark', 'dark');
  await page.locator('#theme').click(); await record('explicit light', 'dark', 'light');
  await preference('light'); await record('explicit light with light system', 'light', 'light');
  await preference('dark'); await record('explicit light with dark system', 'dark', 'light');
  await page.locator('#theme').click(); await record('explicit dark', 'dark', 'dark');
  await preference('light'); await record('explicit dark with light system', 'light', 'dark');
  await preference('dark'); await record('explicit dark with dark system', 'dark', 'dark');
  return observations;
}

export async function assertLibraryThemeTransitions(page, colors) {
  return assertButtonThemeTransitions(page, colors);
}

export async function assertSelectThemeTransitions(page, colors) {
  const timeline = [];
  for (const choice of ['system', 'light', 'dark', 'system']) {
    await page.locator('#theme').selectOption(choice);
    for (const system of ['light', 'dark']) {
      await page.emulateMedia({colorScheme: system});
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const mode = choice === 'system' ? system : choice;
      const palette = await assertPalette(page, colors[mode], mode);
      assert.equal(await page.locator('#theme').inputValue(), choice);
      assert.equal(await page.locator('html').getAttribute('data-theme'), choice === 'system' ? 'auto' : choice);
      timeline.push({choice, systemPreference: system, palette});
    }
  }
  return timeline;
}
