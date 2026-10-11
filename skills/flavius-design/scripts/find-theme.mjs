import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {writeFile} from 'node:fs/promises';
import {sourceFiles,argument} from './lib/files.mjs';
export async function findTheme(root){
 const files=await sourceFiles(root);
 const findings=files.flatMap(({file,text})=>{
  const reasons=[];
  if(/tailwind\.config/.test(file))reasons.push('Tailwind configuration');
  if(/(?:globals?|theme|tokens)\.(?:css|scss|json)$/.test(file))reasons.push('Global/theme/token source');
  if(file.endsWith('components.json'))reasons.push('shadcn configuration');
  const variables=[...text.matchAll(/--[\w-]+\s*:/g)].length;
  const hex=[...text.matchAll(/#[\da-f]{3,8}\b/gi)].length;
  const rgb=[...text.matchAll(/\brgba?\s*\(/g)].length;
  if(variables)reasons.push(`${variables} CSS variable definitions`);
  if(hex||rgb)reasons.push(`${hex} hex and ${rgb} rgb/rgba occurrences`);
  if(/@theme\b/.test(text))reasons.push('Tailwind v4 @theme');
  if(/@import\s+["']tailwindcss/.test(text))reasons.push('Tailwind v4 stylesheet entry');
  return reasons.length?[{file,reasons,variables,hex,rgb}]:[];
 });
 const pkg=files.find(file=>file.file==='package.json');
 const packages=pkg?JSON.parse(pkg.text):{};
 const deps={...packages.dependencies,...packages.devDependencies};
 const frameworks=Object.entries(deps).filter(([name])=>/^(next|react|vue|svelte|tailwindcss|@tanstack\/react-start)$/.test(name));
 const libraries=Object.entries(deps).filter(([name])=>/@radix-ui|@base-ui|shadcn|@mui|chakra|mantine|antd|headlessui/.test(name));
 const routes=files.filter(({file})=>/(?:^|\/)app\/.*(?:page|route)\.[jt]sx?$|(?:^|\/)pages\/|(?:^|\/)routes\//.test(file)).map(({file})=>file);
 return {root:resolve(root),frameworks:Object.fromEntries(frameworks),componentLibraries:Object.fromEntries(libraries),routes,findings,limits:'Occurrences are lexical candidates. Follow imports to identify active definitions; this does not establish runtime theme precedence.'};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const root=resolve(argument('--root',process.cwd()));const report=await findTheme(root);
 const json=JSON.stringify(report,null,2)+'\n';if(argument('--output',null))await writeFile(argument('--output'),json);console.log(json);
}
