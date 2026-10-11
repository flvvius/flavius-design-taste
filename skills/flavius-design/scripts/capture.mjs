import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createRequire} from 'node:module';
import {argument} from './lib/files.mjs';
const base=argument('--url');if(!base)throw new Error('Usage: node capture.mjs --url http://localhost:3000 --routes /,/settings [--states states.json] [--output folder]');
const timestamp=new Date().toISOString().replace(/[:.]/g,'-');
const output=resolve(argument('--output',`design-captures/${timestamp}`));await mkdir(output,{recursive:true});
const routes=argument('--routes','/').split(',').map(route=>({route,name:route}));
const scenarios=argument('--states',null)?JSON.parse(await readFile(argument('--states'),'utf8')):routes;
let chromium;
for(const require of [createRequire(import.meta.url),createRequire(resolve(process.cwd(),'package.json'))]){
 for(const name of ['@playwright/test','playwright'])try{({chromium}=require(name));break;}catch(error){if(error.code!=='MODULE_NOT_FOUND')throw error;}
 if(chromium)break;
}
if(!chromium)throw new Error('Capture requires locally installed Playwright. Install it as dev tooling in the project or run from a workspace that has it.');
const browser=await chromium.launch(),reports=[];
async function act(page,actions=[]){for(const action of actions){const locator=page.locator(action.selector);if(action.click)await locator.click();else if(action.fill!==undefined)await locator.fill(action.fill);else if(action.select!==undefined)await locator.selectOption(action.select);else if(action.waitFor)await locator.waitFor({state:action.waitFor});else throw new Error('Unsupported capture action');}}
try{
for(const scenario of scenarios)for(const width of [375,1280])for(const theme of ['light','dark']){
 const page=await browser.newPage({viewport:{width,height:960},colorScheme:theme,reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 const url=new URL(scenario.route,base).href;
 const response=await page.goto(url,{waitUntil:'networkidle',timeout:45000});
 if(!response?.ok())throw new Error(`${url}: HTTP ${response?.status()}`);
 await act(page,scenario.themeActions?.[theme]);await act(page,scenario.actions);
 await page.waitForFunction(()=>document.fonts.status==='loaded');
 const file=`${reports.length.toString().padStart(3,'0')}-${(scenario.name||scenario.route).replace(/[^a-z0-9-]/gi,'_')}-${width}-${theme}.png`;
 await page.screenshot({path:resolve(output,file),fullPage:true,animations:'disabled'});
 const observed=await page.evaluate(()=>({background:getComputedStyle(document.body).backgroundColor,foreground:getComputedStyle(document.body).color,rootTheme:document.documentElement.dataset.theme,rootClass:document.documentElement.className,width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
 reports.push({route:scenario.route,state:scenario.name||scenario.route,width,requestedScheme:theme,observed,file,errors});await page.close();
}
}finally{
 await writeFile(resolve(output,'manifest.json'),JSON.stringify({capturedAt:new Date().toISOString(),browser:browser.version(),baseUrl:base,scenarios,reports,note:'Requested media scheme is not proof of a supported palette. Inspect observed colors and use explicit themeActions when the app overrides system preference.'},null,2)+'\n');
 await browser.close();
}
console.log(JSON.stringify({output,captures:reports.length,pageErrors:reports.reduce((n,r)=>n+r.errors.length,0)}));
if(reports.some(report=>report.errors.length))process.exitCode=1;
