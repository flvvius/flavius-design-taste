import {tmpdir} from 'node:os';
import {serve, waitForFonts} from './lib/browser-checks.mjs';
import {captureSources} from './lib/source-snapshot.mjs';
import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, writeFile, stat, mkdir, mkdtemp, readdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const cycle = process.argv[2];
if (!/^\d{2}$/.test(cycle ?? '')) throw new Error('Usage: node scripts/evaluate.mjs 01');
const outputIndex = process.argv.indexOf('--output');
if (outputIndex !== -1 && !process.argv[outputIndex + 1]) throw new Error('--output requires a directory');
const dir = outputIndex === -1 ? await mkdtemp(resolve(tmpdir(), 'taste-archive-')) : resolve(process.argv[outputIndex + 1]);
const archive = resolve(root, 'eval/archive');
if (dir === archive || dir.startsWith(archive + sep)) throw new Error('Output must be outside the frozen archive');
await mkdir(dir, {recursive: true});
async function inputs(directory) {
  const paths = [];
  for (const entry of await readdir(resolve(root, directory), {withFileTypes: true})) {
    const path = directory + '/' + entry.name;
    paths.push(...(entry.isDirectory() ? await inputs(path) : [path]));
  }
  return paths;
}
const sourcePaths = [...await inputs('eval/archive/skills'), ...await inputs('eval/archive/eval/cycles/' + cycle)];
const snapshot = await captureSources(root, sourcePaths);
const server = await serve(root, snapshot.files);
const browser = await chromium.launch({headless:true});
const reports = [];
try {
  for (const {width,fontScale} of [{width:375,fontScale:1},{width:1280,fontScale:1},{width:375,fontScale:2}]) for (const theme of ['light','dark']) {
    const context = await browser.newContext({viewport:{width,height:960},colorScheme:theme});
    const page = await context.newPage();
    const errors = []; const failedRequests = [];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400)failedRequests.push({url:response.url(),status:response.status()});});
    const response=await page.goto(`${server.url}/eval/archive/eval/cycles/${cycle}/`,{waitUntil:'networkidle'});
    if (!response?.ok()) throw new Error(`Cycle ${cycle} did not load: ${response?.status()}`);
    await page.evaluate(t=>{document.documentElement.classList.toggle('dark',t==='dark');document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;},theme);
    await waitForFonts(page);
    if(fontScale!==1)await page.evaluate(scale=>{const sizes=[...document.querySelectorAll('body,body *')].filter(el=>el instanceof HTMLElement&&!['SCRIPT','STYLE'].includes(el.tagName)).map(el=>[el,parseFloat(getComputedStyle(el).fontSize)]);for(const [el,size] of sizes)el.style.fontSize=size*scale+'px';},fontScale);
    const audit = await page.evaluate(() => {
      const canvas=document.createElement('canvas');canvas.width=canvas.height=1;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});
      const rgb=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].map((v,i)=>i===3?v/255:v);};
      const over=(a,b)=>[...a.slice(0,3).map((v,i)=>v*a[3]+b[i]*(1-a[3])),1];
      const luminance=c=>c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
      const background=el=>{const stack=[];for(let n=el;n;n=n.parentElement)stack.push(rgb(getComputedStyle(n).backgroundColor));return stack.reverse().reduce((b,a)=>over(a,b),[255,255,255,1]);};
      const visible=el=>{const s=getComputedStyle(el);return el.getClientRects().length&&s.visibility!=='hidden'&&s.display!=='none';};
      const contrast=[];
      for(const el of document.querySelectorAll('body *')) {
        if(!visible(el)||['STYLE','SCRIPT','OPTION','SVG','PATH'].includes(el.tagName)||el.closest('[disabled],[aria-disabled="true"]'))continue;
        const text=[...el.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent.trim()).join(' ').trim();
        if(!text)continue;
        const s=getComputedStyle(el);const bg=background(el);const fg=over(rgb(s.color),bg);
        const a=luminance(fg),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
        const large=parseFloat(s.fontSize)>=24||(parseFloat(s.fontSize)>=18.66&&parseInt(s.fontWeight)>=700);
        if(ratio<(large?3:4.5))contrast.push({text:text.slice(0,90),tag:el.tagName,ratio:+ratio.toFixed(2),required:large?3:4.5,color:s.color,background:bg});
      }
      const unlabeled=[...document.querySelectorAll('input:not([type="hidden"]),select,textarea')].filter(el=>visible(el)&&!el.labels?.length&&!el.getAttribute('aria-label')&&!el.getAttribute('aria-labelledby')).map(el=>el.outerHTML.slice(0,180));
      const targetRect=el=>{const own=el.getBoundingClientRect();if(el.matches('input[type=checkbox],input[type=radio]')){const label=[...(el.labels??[])].find(visible);if(label){const r=label.getBoundingClientRect();if(r.width>=own.width&&r.height>=own.height)return r;}}return own;};
      const smallTargets=[...document.querySelectorAll('button,a[href],input:not([type="hidden"]),select')].filter(visible).filter(el=>{const r=targetRect(el);return r.width<24||r.height<24;}).map(el=>({text:(el.textContent||el.getAttribute('aria-label')||el.tagName).trim().slice(0,50),width:Math.round(targetRect(el).width),height:Math.round(targetRect(el).height)}));
      return {overflow:document.documentElement.scrollWidth>innerWidth,contrast,unlabeled,smallTargets};
    });
    await page.screenshot({path:resolve(dir,`${width}-${theme}${fontScale===1?'':'-200pct'}.png`),fullPage:true,animations:'disabled'});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.keyboard.press('Tab');
    const keyboardFocus=await page.evaluate(()=>({tag:document.activeElement.tagName,text:(document.activeElement.textContent||document.activeElement.getAttribute('aria-label')||'').trim().slice(0,80)}));
    reports.push({width,theme,fontScale,errors,failedRequests,...audit,keyboardFocus});
    await context.close();
  }
  await writeFile(resolve(dir,'checks.json'),JSON.stringify({cycle,output:dir,sources:snapshot.hashes,reports,note:'Contrast scan covers visible direct text on composited solid backgrounds. Images, pseudo-elements, opacity, charts, focus boundaries and interaction semantics require independent review.'},null,2)+'\n');
  console.log(JSON.stringify({cycle,reports:reports.map(({width,theme,fontScale,errors,failedRequests,overflow,contrast,unlabeled,smallTargets})=>({width,theme,fontScale,errors,failedRequests,overflow,contrastIssues:contrast.length,unlabeled,smallTargets}))}));
  if(reports.some(report=>report.errors.length||report.failedRequests.length||report.overflow||report.contrast.length||report.unlabeled.length||report.smallTargets.length))process.exitCode=1;
} finally {await browser.close();await server.close();}
