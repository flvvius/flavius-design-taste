import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {extname, resolve, sep} from 'node:path';

export async function serve(root, files) {
  root = resolve(root);
  const mime = {'.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.mjs':'text/javascript', '.json':'application/json', '.woff2':'font/woff2', '.ttf':'font/ttf', '.png':'image/png', '.svg':'image/svg+xml'};
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://local').pathname);
      const path = resolve(root, '.' + pathname);
      if (path !== root && !path.startsWith(root + sep)) {
        response.writeHead(403).end();
        return;
      }
      const file = files ? (files.has(path) ? path : resolve(path, 'index.html')) : (await stat(path)).isDirectory() ? resolve(path, 'index.html') : path;
      const bytes = files ? files.get(file) : await readFile(file);
      if (bytes === undefined) throw new Error('File is outside the captured inputs');
      response.setHeader('Content-Type', mime[extname(file)] ?? 'application/octet-stream');
      response.end(bytes);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise((done, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', done);
  });
  return {url: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(done => server.close(done))};
}

export async function enlargeText(page, scale = 2) {
  return page.evaluate(scale => {
    const sizes = [...document.querySelectorAll('body, body *')]
      .filter(element => element instanceof HTMLElement && !['STYLE', 'SCRIPT', 'NOSCRIPT'].includes(element.tagName))
      .map(element => [element, parseFloat(getComputedStyle(element).fontSize)]);
    for (const [element, size] of sizes) element.style.fontSize = `${size * scale}px`;
    return sizes.length;
  }, scale);
}

export async function applyTextSpacing(page) {
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = '* {line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important} p {margin-block-end: 2em !important}';
    document.head.append(style);
    if (!style.sheet?.cssRules.length) throw new Error('Text spacing override was not installed');
  });
}

export async function inspectPage(page) {
  return page.evaluate(() => {
    const visible = element => {
      if (!element.getClientRects().length) return false;
      for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor);
        if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0) return false;
        if (style.clipPath === 'inset(50%)' || style.clip === 'rect(0px, 0px, 0px, 0px)') return false;
      }
      return true;
    };
    const clippedTabStops = [...document.querySelectorAll('button, a[href], input:not([type="hidden"]), select, textarea, [tabindex]')].filter(element => {
      if (element.tabIndex < 0 || element.disabled || !element.getClientRects().length || visible(element)) return false;
      let clipped = false;
      for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        if (style.clipPath === 'inset(50%)' || style.clip === 'rect(0px, 0px, 0px, 0px)') clipped = true;
      }
      return clipped;
    }).map(element => element.outerHTML.slice(0, 160));
    const label = element => (element.textContent || element.getAttribute('aria-label') || element.tagName).trim().slice(0, 90);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', {willReadFrequently: true});
    const rgba = color => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data].map((value, index) => index === 3 ? value / 255 : value);
    };
    const over = (front, back) => [...front.slice(0, 3).map((value, index) => value * front[3] + back[index] * (1 - front[3])), 1];
    const luminance = color => color.slice(0, 3).map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
    const background = element => {
      const colors = [];
      for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) colors.push(rgba(getComputedStyle(ancestor).backgroundColor));
      return colors.reverse().reduce((back, front) => over(front, back), [255, 255, 255, 1]);
    };
    const contrast = [], clippedText = [], outsideViewport = [];
    for (const element of document.querySelectorAll('body *')) {
      if (!(element instanceof HTMLElement) || !visible(element) || ['STYLE', 'SCRIPT', 'NOSCRIPT', 'OPTION'].includes(element.tagName)) continue;
      const style = getComputedStyle(element), bounds = element.getBoundingClientRect();
      if (!element.classList.contains('skip') && (bounds.left < -1 || bounds.right > innerWidth + 1)) outsideViewport.push({text: label(element), tag: element.tagName, left: bounds.left, right: bounds.right});
      const nodes = [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      if (!nodes.length || element.closest('[disabled], [aria-disabled="true"]')) continue;
      const backdrop = background(element), foreground = over(rgba(style.color), backdrop);
      const first = luminance(foreground), second = luminance(backdrop);
      const ratio = (Math.max(first, second) + .05) / (Math.min(first, second) + .05);
      const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && parseInt(style.fontWeight) >= 700);
      if (ratio < (large ? 3 : 4.5)) contrast.push({text: label(element), ratio: +ratio.toFixed(2), required: large ? 3 : 4.5});
      for (const node of nodes) {
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const rect of range.getClientRects()) {
          for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
            const computed = getComputedStyle(ancestor), clip = ancestor.getBoundingClientRect();
            const x = ['hidden', 'clip'].includes(computed.overflowX) && (rect.left < clip.left - 1 || rect.right > clip.right + 1);
            const y = ['hidden', 'clip'].includes(computed.overflowY) && (rect.top < clip.top - 1 || rect.bottom > clip.bottom + 1);
            if (x || y) {clippedText.push({text: label(element), clippedBy: ancestor.tagName}); break;}
          }
        }
      }
    }
    const unlabeled = [...document.querySelectorAll('input:not([type="hidden"]), select, textarea')].filter(visible).filter(element => !element.labels?.length && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')).map(element => element.outerHTML.slice(0, 120));
    const smallTargets = [...document.querySelectorAll('button, summary, input:not([type="hidden"]), select')].filter(visible).filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width < 24 || rect.height < 24;
    }).map(element => ({text: label(element), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height}));
    return {width: innerWidth, scrollWidth: document.documentElement.scrollWidth, overflow: document.documentElement.scrollWidth > innerWidth, outsideViewport, clippedText, contrast, unlabeled, smallTargets, clippedTabStops};
  });
}

export async function waitForFonts(page, timeout = 10000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await page.evaluate(() => document.fonts.status) === 'loaded') return;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error('Font loading did not settle within the verification deadline');
}

export async function forcedColorSupport(browser) {
  const page = await browser.newPage({forcedColors: 'active'});
  try {
    await page.setContent('<body style="color:rgb(1,2,3);background:rgb(4,5,6)">Colour substitution probe</body>');
    return await page.evaluate(() => {
      const style = getComputedStyle(document.body);
      return {media: matchMedia('(forced-colors: active)').matches, colorSubstitution: style.color !== 'rgb(1, 2, 3)' && style.backgroundColor !== 'rgb(4, 5, 6)'};
    });
  } finally {await page.close();}
}

export async function measureHoverTransforms(page, linkSelector, targetSelector) {
  const target = page.locator(targetSelector).first();
  const settledTransform = async () => {
    await target.evaluate(element => getComputedStyle(element).transform);
    await page.waitForFunction(selector => document.querySelector(selector).getAnimations().every(animation => animation.playState !== 'running'), targetSelector, {timeout: 1000});
    return target.evaluate(element => getComputedStyle(element).transform);
  };
  const before = await settledTransform();
  const link = page.locator(linkSelector).first();
  await link.hover();
  return {before, after: await settledTransform(), hovered: await link.evaluate(element => element.matches(':hover'))};
}
