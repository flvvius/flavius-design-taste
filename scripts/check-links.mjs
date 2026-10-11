import {readFileSync, readdirSync, existsSync, statSync} from 'node:fs';
import {resolve, dirname, relative, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const ignored = new Set(['.git', 'node_modules', '.artifacts', 'dist', '.next']);
const slug = text => text.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s/g, '-');
export function checkLinks(root, {isolated = false, excludeArchive = false} = {}) {
  root = resolve(root);
  const failures = [];
  const anchors = path => {
    const source = readFileSync(path, 'utf8');
    const ids = new Set([...source.matchAll(/\b(?:id|name)=["']([^"']+)["']/g)].map(match => match[1]));
    for (const match of source.matchAll(/\bdata-view=["']([^"']+)["']/g)) ids.add('/' + match[1]);
    const seen = new Map();
    if (path.endsWith('.md')) for (const match of source.matchAll(/^#{1,6}\s+(.+)$/gm)) {
      const base = slug(match[1]), count = seen.get(base) ?? 0;
      ids.add(base + (count ? '-' + count : '')); seen.set(base, count + 1);
    }
    return ids;
  };
  function visit(directory) {
    for (const entry of readdirSync(directory, {withFileTypes: true})) {
      if (ignored.has(entry.name) || excludeArchive && resolve(directory, entry.name) === resolve(root, 'eval/archive')) continue;
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) {visit(path); continue;}
      if (!/\.(md|html|css)$/.test(path)) continue;
      const raw = readFileSync(path, 'utf8');
      const text = path.endsWith('.md') ? raw.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '').replace(/`[^`\n]*`/g, '') : raw;
      const links = [];
      const definitions = new Map([...text.matchAll(/^\s{0,3}\[([^\]]+)\]:\s*<?([^\s>]+)>?/gm)].map(match => [match[1].toLowerCase(), match[2]]));
      if (path.endsWith('.md')) {
        for (const match of text.matchAll(/!?\[[^\]]*\]\(\s*(<[^>]+>|[^\s)]+)(?:\s+["'][^\n]*["'])?\s*\)/g)) links.push(match[1].replace(/^<|>$/g, ''));
        for (const match of text.matchAll(/!?\[([^\]]+)\]\[([^\]]*)\]/g)) {
          const key = (match[2] || match[1]).toLowerCase();
          if (definitions.has(key)) links.push(definitions.get(key));
          else failures.push({file: relative(root, path), target: key, reason: 'Undefined reference link'});
        }
      }
      if (/\.(md|html)$/.test(path)) for (const match of text.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) links.push(match[1]);
      if (path.endsWith('.css')) {
        for (const match of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) links.push(match[1].trim());
        for (const match of text.matchAll(/@import\s+["']([^"']+)["']/g)) if (match[1].startsWith('.')) links.push(match[1]);
      }
      for (const target of links) {
        if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(target)) continue;
        const [pathname, fragment] = target.split('#');
        let decoded;
        try {decoded = decodeURIComponent(pathname.split('?')[0]);} catch {failures.push({file: relative(root, path), target, reason: 'Invalid encoded path'}); continue;}
        const destination = decoded ? resolve(decoded.startsWith('/') ? root : dirname(path), decoded.startsWith('/') ? '.' + decoded : decoded) : path;
        const outside = destination !== root && !destination.startsWith(root + sep);
        let reason;
        if (isolated && outside) reason = 'Dependency leaves the installed package';
        else if (!existsSync(destination)) reason = 'Missing local target';
        else if (fragment && /\.(md|html)$/.test(destination) && !statSync(destination).isDirectory() && !anchors(destination).has(decodeURIComponent(fragment))) reason = 'Missing local anchor';
        if (reason) failures.push({file: relative(root, path), target, reason});
      }
    }
  }
  visit(root);
  return failures;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = resolve(process.argv.find(value => value.startsWith('--root='))?.slice(7) ?? fileURLToPath(new URL('../', import.meta.url)));
  const failures = checkLinks(root, {isolated: process.argv.includes('--isolated'), excludeArchive: true});
  if (existsSync(resolve(root, 'eval/archive'))) failures.push(...checkLinks(resolve(root, 'eval/archive'), {isolated: true}).map(failure => ({...failure, file: 'eval/archive/' + failure.file})));
  for (const failure of failures) console.error(`${failure.file}: ${failure.target}: ${failure.reason}`);
  console.log(JSON.stringify({root, failures: failures.length}));
  if (failures.length) process.exitCode = 1;
}
