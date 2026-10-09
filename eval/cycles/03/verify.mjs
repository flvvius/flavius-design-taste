import {chromium} from '@playwright/test';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:375,height:960}});
const report=[];
try {
 for(const locale of ['en-US','de-DE','ar']) {
  await page.goto(new URL('index.html',import.meta.url).href);
  await page.selectOption('#locale',locale);
  await page.evaluate(()=>{const sizes=[...document.querySelectorAll('body,body *')].filter(e=>e instanceof HTMLElement&&!['SCRIPT','STYLE'].includes(e.tagName)).map(e=>[e,parseFloat(getComputedStyle(e).fontSize)]);for(const [e,size] of sizes)e.style.fontSize=size*2+'px';});
  const data=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,filterWidth:document.querySelector('#filter').getBoundingClientRect().width,summaryLines:[...document.querySelectorAll('dd bdi')].map(e=>{const range=document.createRange();range.selectNodeContents(e);return new Set([...range.getClientRects()].map(r=>Math.round(r.top))).size;})}));
  assert.equal(data.overflow,false,locale);
  assert(data.summaryLines.every(n=>n===1),`${locale}: broken amount`);
  await page.screenshot({path:new URL(`375-${locale}-enlarged.png`,import.meta.url).pathname,fullPage:true});
  report.push({locale,...data});
 }
 writeFileSync(new URL('localization-checks.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report));
} finally {await browser.close();}
