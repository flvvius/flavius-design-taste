import {test} from 'node:test';
import assert from 'node:assert/strict';
import {contrast, luminance} from '../lib/contrast.mjs';
import {srgb} from '../build.mjs';

test('opaque contrast anchors and equivalent channels', () => {
  assert.equal(contrast('#000000', '#ffffff'), 21);
  assert.equal(contrast('#ffffff', '#000000'), 21);
  assert.equal(contrast('#abcdef', '#abcdef'), 1);
  assert.equal(luminance('#FFFFFF'), 1);
});

test('alpha must be composited instead of counted as opaque', () => {
  const translucent = contrast('#00000080', '#ffffff');
  assert(translucent > 3.9 && translucent < 4.1);
  assert.equal(contrast('#00000000', '#ffffff'), 1);
  assert.equal(contrast('#ffffff', '#00000000', '#ffffff'), 1);
  assert.throws(() => contrast('#ffffff', '#00000080'), /opaque canvas/);
  assert.throws(() => luminance('#00000080'), /opaque background/);
  assert.throws(() => contrast('#000000', '#xyzxyz'), /hex colour/);
});

test('OKLCH conversion rejects invalid sources and preserves anchors', () => {
  assert.equal(srgb('oklch(0 0 0)'), '#000000');
  assert.equal(srgb('oklch(1 0 0)'), '#ffffff');
  assert.equal(srgb('oklch(0 0 0 / 50%)'), '#00000080');
  assert.equal(srgb('oklch(0.5 0 -30)'), srgb('oklch(0.5 0 330)'));
  for (const value of ['prefix oklch(1 0 0)', 'oklch(1 0 0) trailing', 'oklch(1.1 0 0)', 'oklch(0.5 0 0 / 101%)', 'oklch(. 0 0)', null]) assert.throws(() => srgb(value));
});
