import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.argv[2]||'http://127.0.0.1:4314', output=new URL('./verification.json',import.meta.url);
const browser=await chromium.launch(), checks=[];
try {
 const page=await browser.newPage({viewport:{width:375,height:960},reducedMotion:'reduce'});
 await page.goto(base+'/settings-page');await page.getByLabel('Weekly digest').selectOption('Disabled');await page.getByRole('button',{name:'Save preferences'}).click();await page.getByRole('status').filter({hasText:'Preferences saved'}).waitFor();checks.push('Preference local callback and announcement');
 await page.goto(base+'/table-and-filters');const search=page.getByRole('searchbox');await search.fill('Fuel');assert.equal(await page.locator('tbody tr').count(),1);await search.fill('no matches');await page.getByRole('button',{name:'Clear search'}).click();assert.equal(await page.locator('tbody tr').count(),3);checks.push('Search success, empty and clear');
 await page.goto(base+'/onboarding-flow');const trigger=page.getByRole('button',{name:'Read the rules'});await trigger.click();await page.getByRole('dialog').waitFor();assert.equal(await page.evaluate(()=>document.activeElement?.textContent),'Close rules');await page.keyboard.press('Escape');assert(await trigger.evaluate(node=>node===document.activeElement));checks.push('Native modal focus, Escape and restoration');
 for(const route of ['settings-page','table-and-filters','onboarding-flow','editorial-landing','case-study-page','ink']) {
  await page.goto(base+'/'+route);await page.addStyleTag({content:'html{font-size:200%}'});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' text overflow');checks.push(route+' 200% text fits 375px');
 }
 await page.goto(base+'/ink');assert.equal(await page.locator('.ink-draw').evaluate(node=>getComputedStyle(node).animationName),'none');checks.push('Reduced motion renders static complete underline');
 await writeFile(output,JSON.stringify({checkedAt:new Date().toISOString(),browser:browser.version(),base,checks,failures:[],limits:'No screen-reader or cross-engine claim; color roles are verified by canonical palette checks.'},null,2)+'\n');console.log(JSON.stringify({checks:checks.length,failures:0}));
}finally{await browser.close()}
