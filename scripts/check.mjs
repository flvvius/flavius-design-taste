import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {outputs,srgb} from './build.mjs';
import {contrast} from './lib/contrast.mjs';
import {checkLocalAssetLinks} from './lib/asset-links.mjs';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url), assets=new URL('skills/editorial-calm/assets/',root);
const tokens=JSON.parse(readFileSync(new URL('tokens.json',assets)));
assert.deepEqual(Object.keys(tokens.colors.light).sort(),Object.keys(tokens.colors.dark).sort());
assert.equal(srgb('oklch(0 0 0)'),'#000000');
assert.equal(srgb('oklch(1 0 0)'),'#ffffff');
assert.equal(srgb('oklch(0 0 0 / 50%)'),'#00000080');
for(const [name,expected] of Object.entries(outputs()))assert.equal(readFileSync(new URL(name,assets),'utf8'),expected,`${name} needs regeneration`);
for(const file of ['README.md','skills/editorial-calm/SKILL.md','skills/editorial-calm/references/web.md','skills/editorial-calm/references/mobile.md','skills/editorial-calm/references/desktop.md','skills/editorial-calm/references/patterns.md','skills/editorial-calm/references/review.md']){
 const url=new URL(file,root),text=readFileSync(url,'utf8');
 for(const [,target] of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g))if(!target.startsWith('https:'))assert(existsSync(new URL(target,url)),`${file}: missing ${target}`);
}
assert(tokens.motion.max<=300);
console.log('Verified token parity, generated assets, conversion anchors, reference links and motion limit.');
const skill=readFileSync(new URL('skills/editorial-calm/SKILL.md',root),'utf8');
assert.match(skill,/^---\nname: editorial-calm\ndescription: [^\n]+\n---\n/);
assert(!/TODO|\[INSERT|TBD/.test(skill));
console.log('Verified skill identity, description and absence of unfinished placeholders.');
for (const [mode,roles] of Object.entries(tokens.colors)) {
  for (const role of ['primary','secondary','card','popover','accent','destructive','success','warning']) {
    const ratio=contrast(srgb(roles[role]),srgb(roles[role+'-foreground']));
    assert(ratio>=4.5,`${mode} ${role} label contrast ${ratio.toFixed(2)} is below 4.5:1`);
  }
}
console.log('Verified normal-text contrast for semantic foreground/background pairs.');
for (const [mode,roles] of Object.entries(tokens.colors)) {
  for (const surface of ['background','card','popover','secondary']) {
    assert(contrast(srgb(roles.input),srgb(roles[surface]))>=3,`${mode} input boundary on ${surface} is below 3:1`);
  }
  for (const role of ['success','destructive','warning-text']) {
    assert(contrast(srgb(roles[role]),srgb(roles.background))>=4.5,`${mode} ${role} page text is below 4.5:1`);
  }
}
console.log('Verified essential input boundaries and page status text contrast.');
assert.deepEqual(checkLocalAssetLinks(fileURLToPath(root)),[],'Missing local document, image, stylesheet or font asset');
console.log('Verified local links and asset paths throughout documentation and examples.');
