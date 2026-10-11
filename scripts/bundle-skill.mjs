import {cp, mkdir, readdir, readFile, writeFile, mkdtemp} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve, relative, dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {checkLinks} from './check-links.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
export async function bundleSkill(name, output) {
  const source = resolve(root, name === 'flavius-design' ? 'skills/' + name : 'directions/' + name);
  if (!existsSync(source)) throw new Error('Missing skill: ' + name);
  await mkdir(output, {recursive: true});
  await cp(source, output, {recursive: true});
  const copies = [[source, output]];
  for (const directory of name === 'flavius-design' ? ['core', 'directions', 'references', 'recipes'] : ['core', 'references']) {
    if (!existsSync(resolve(root, directory))) continue;
    const destination = resolve(output, directory === 'references' ? 'shared-references' : directory);
    await cp(resolve(root, directory), destination, {recursive: true});
    copies.push([resolve(root, directory), destination]);
  }
  async function rewrite(directory, original) {
    for (const entry of await readdir(directory, {withFileTypes: true})) {
      const path = resolve(directory, entry.name), origin = resolve(original, entry.name);
      if (entry.isDirectory()) {await rewrite(path, origin); continue;}
      if (entry.name.endsWith('.md')) {
        const text = await readFile(path, 'utf8');
        await writeFile(path, text.replace(/(\]\()(?![a-z]+:|#)([^)]+)(\))/g, (match, start, target, end) => {
          const absolute = resolve(dirname(origin), target);
          const mapping = copies.find(([from]) => absolute === from || absolute.startsWith(from + '/'));
          return mapping ? start + relative(dirname(path), resolve(mapping[1], relative(mapping[0], absolute))) + end : match;
        }));
      }
    }
  }
  for (const [from, to] of copies) await rewrite(to, from);
  const failures = checkLinks(output, {isolated: true});
  if (failures.length) throw new Error(JSON.stringify(failures, null, 2));
  return {name, output, localLinkFailures: 0};
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const staging = await mkdtemp(resolve(tmpdir(), 'flavius-skills-'));
  const names = ['editorial-calm', 'personal-room', ...(existsSync(resolve(root, 'skills/flavius-design')) ? ['flavius-design'] : [])];
  for (const name of names) {
    const isolated = resolve(staging, name);
    const result = await bundleSkill(name, isolated);
    await cp(isolated, resolve(root, 'dist', name), {recursive: true});
    console.log(JSON.stringify(result));
  }
}
