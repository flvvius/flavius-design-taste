import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {findTheme} from '../../skills/flavius-design/scripts/find-theme.mjs';
import {lintText,rules} from '../../skills/flavius-design/scripts/slop-lint.mjs';

test('discovery finds real theme declarations and ignores dependency and symlink trees',async()=>{
 const root=await mkdtemp(join(tmpdir(),'taste-discovery-'));
 await mkdir(join(root,'app'));await mkdir(join(root,'node_modules'));
 await writeFile(join(root,'package.json'),JSON.stringify({dependencies:{next:'16.4.0',tailwindcss:'4.3.3','@radix-ui/react-dialog':'1.0.0'}}));
 await writeFile(join(root,'components.json'),'{}');await writeFile(join(root,'app/globals.css'),'@import "tailwindcss"; @theme inline {--color-accent:#c4321c;}');
 await writeFile(join(root,'node_modules/noise.css'),'#123456 #123456');
 const report=await findTheme(root);assert.equal(report.frameworks.next,'16.4.0');assert.equal(report.findings.find(x=>x.file==='app/globals.css').hex,1);assert(!report.findings.some(x=>x.file.startsWith('node_modules')));
});

test('lint detects all candidate categories and preserves deliberate aesthetic choices',()=>{
 assert.equal(rules.length,15);
 const bad=`<Card><Card>Account</Card></Card>
<section className="border shadow-lg rounded-2xl">Settings</section>
<div className="text-center grid-cols-3 rounded-xl"></div>
<div className="blur-3xl bg-gradient-to-r"></div>
<span className="rounded-full bg-green-100">Saved</span>
<p className="bg-white text-gray-300">Required</p>
<input className="rounded-3xl" />
<div className="p-[13px] gap-[19px]" />
<div className="bg-red-100 bg-blue-100 bg-violet-100 bg-lime-100 bg-pink-100" />
<nav className="fixed bottom-6 backdrop-blur-xl" />
<p className="rotate-3">Instructions</p>
<button className="opacity-0 group-hover:opacity-100">Open</button>
button{transition:all 400ms;animation:spin 1s infinite}
<Button>Make magic</Button>`;
 const found=new Set(lintText('bad.tsx',bad).map(x=>x.rule));assert.equal(found.size,15);
 assert.deepEqual(lintText('authored.tsx','<section className="bg-[#f4efe6] border-t font-serif">Price methodology</section>'),[]);
 assert.deepEqual(lintText('note.tsx','<aside className="rotate-2 shadow-[2px_3px_0_#e0d5c2]">Taped note</aside>'),[]);
 assert.deepEqual(lintText('deliberate.tsx','// taste-allow control-radius -- Branded pill field approved in the brief\n<input className="rounded-3xl" />'),[]);
 assert.deepEqual(lintText('temperature.tsx','<div className="bg-red-100 bg-blue-100 bg-violet-100 bg-lime-100 bg-pink-100" />',{allow:[{file:'temperature.tsx',rule:'accent-sprawl',reason:'Labeled temperature scale'}]}),[]);
 assert(lintText('bad.tsx',bad).every(x=>x.line>0&&x.why&&x.suggestedFix));
});
