import {chromium} from '@playwright/test';
const browser=await chromium.launch();
try {
 for(const width of [375,1280])for(const theme of ['light','dark']) {
  const page=await browser.newPage({viewport:{width,height:720},colorScheme:theme});
  await page.goto(new URL('index.html',import.meta.url).href);
  await page.fill('#bio','I write about work, reading and local walks. '.repeat(13));
  await page.getByRole('button',{name:'Review changes'}).click();
  if(width===375)await page.evaluate(()=>{const sizes=[...document.querySelectorAll('body,body *')].filter(e=>e instanceof HTMLElement&&!['SCRIPT','STYLE'].includes(e.tagName)).map(e=>[e,parseFloat(getComputedStyle(e).fontSize)]);for(const [e,size] of sizes)e.style.fontSize=size*2+'px';});
  await page.locator('dialog').evaluate(e=>e.scrollTop=0);
  await page.screenshot({path:new URL(`dialog-${width}-${theme}.png`,import.meta.url).pathname,animations:'disabled'});
  await page.close();
 }
} finally {await browser.close();}
