function rgba(hex) {
  if (typeof hex !== 'string' || !/^#[\da-f]{6}(?:[\da-f]{2})?$/i.test(hex)) throw new Error(`Expected a six or eight digit hex colour: ${hex}`);
  return [...hex.slice(1, 7).match(/../g).map(channel => parseInt(channel, 16) / 255), hex.length === 9 ? parseInt(hex.slice(7), 16) / 255 : 1];
}
function over(front, back) {
  return [...front.slice(0, 3).map((value, index) => value * front[3] + back[index] * (1 - front[3])), 1];
}
function relativeLuminance(channels) {
  return channels.slice(0, 3).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
}
export function luminance(hex) {
  const color = rgba(hex);
  if (color[3] !== 1) throw new Error('Transparent colour needs an opaque background before measuring luminance');
  return relativeLuminance(color);
}
export function contrast(foreground, background, canvas) {
  let back = rgba(background);
  if (back[3] !== 1) {
    if (!canvas) throw new Error('Transparent background needs an opaque canvas for contrast');
    const base = rgba(canvas);
    if (base[3] !== 1) throw new Error('Contrast canvas must be opaque');
    back = over(back, base);
  }
  const front = over(rgba(foreground), back);
  const first = relativeLuminance(front), second = relativeLuminance(back);
  return (Math.max(first, second) + .05) / (Math.min(first, second) + .05);
}
