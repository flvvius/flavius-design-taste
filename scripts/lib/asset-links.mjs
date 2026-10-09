import {readFileSync,readdirSync,statSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
export function checkLocalAssetLinks(root) {
  const failures=[];
  const visit=dir=>{
    for(const name of readdirSync(dir)) {
      if(['.git','node_modules'].includes(name))continue;
      const path=resolve(dir,name);
      if(statSync(path).isDirectory()){visit(path);continue;}
      if(!/\.(md|html|css)$/.test(name))continue;
      const text=readFileSync(path,'utf8');
      const targets=[];
      if(name.endsWith('.md'))for(const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g))targets.push(match[1]);
      if(/\.(html|md)$/.test(name))for(const match of text.matchAll(/\b(?:href|src)=["']([^"']+)["']/g))targets.push(match[1]);
      if(name.endsWith('.css'))for(const match of text.matchAll(/url\(["']?([^"')]+)["']?\)/g))targets.push(match[1]);
      for(const target of targets) {
        if(/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(target))continue;
        const file=target.split(/[?#]/)[0];
        if(!file)continue;
        const resolved=resolve(target.startsWith('/')?root:dirname(path),target.startsWith('/')?'.'+file:file);
        if(!existsSync(resolved))failures.push({path,target});
      }
    }
  };
  visit(root);
  return failures;
}
