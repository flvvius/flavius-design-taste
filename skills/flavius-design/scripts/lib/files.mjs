import {readdir, readFile} from 'node:fs/promises';
import {resolve, relative} from 'node:path';
const skip=new Set(['.git','node_modules','.next','dist','build','.artifacts','coverage','archive']);
export async function sourceFiles(root) {
 const files=[];
 async function visit(dir){for(const entry of await readdir(dir,{withFileTypes:true})){
  if(skip.has(entry.name)||entry.isSymbolicLink())continue;
  const path=resolve(dir,entry.name);
  if(entry.isDirectory())await visit(path);
  else if(/\.(?:[cm]?[jt]sx?|css|scss|json)$/.test(entry.name)&&!/lock|\.min\./.test(entry.name)){
   const text=await readFile(path,'utf8');files.push({path,file:relative(root,path).replaceAll('\\','/'),text});
  }
 }}
 await visit(resolve(root));return files.sort((a,b)=>a.file.localeCompare(b.file));
}
export function argument(name,fallback){const i=process.argv.indexOf(name);if(i===-1)return fallback;if(!process.argv[i+1]||process.argv[i+1].startsWith('--'))throw new Error(name+' requires a value');return process.argv[i+1];}
