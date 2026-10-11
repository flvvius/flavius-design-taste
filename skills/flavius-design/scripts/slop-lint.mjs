import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFile,writeFile} from 'node:fs/promises';
import {sourceFiles,argument} from './lib/files.mjs';
export const rules=[
 ['nested-cards','Repeated card boundaries obscure grouping.','Use separated rows or explain each boundary.',/<Card\b[\s\S]{0,1200}?<Card\b/g],
 ['section-chrome','Ordinary section chrome competes with content.','Use page background and a rule, or record the surface purpose.',/<(?:section|article)\b[^>]*className=["'][^"']*(?=[^"']*\bborder\b)(?=[^"']*\bshadow(?:-\w+)?)(?=[^"']*\brounded)[^"']*["']/g],
 ['feature-template','A generic feature grid may ignore the subject.','Compare a hierarchy grounded in specific claims.',/(?:text-center[\s\S]{0,500}grid-cols-3[\s\S]{0,500}rounded-(?:xl|2xl)|grid-cols-3[\s\S]{0,500}text-center[\s\S]{0,500}rounded-(?:xl|2xl))/g],
 ['gradient-glow','An unexplained glow adds atmosphere without meaning.','Use a subject-related visual or record its purpose.',/(?:blur-(?:2xl|3xl)[^"'\n]{0,160}(?:bg-gradient|bg-linear)|(?:bg-gradient|bg-linear)[^"'\n]{0,160}blur-(?:2xl|3xl))/g],
 ['status-pills','Plain statuses do not automatically earn filled pills.','Use readable words and an optional glyph.',/<span\b[^>]*(?=[^>]*rounded-full)(?=[^>]*bg-(?:green|red|yellow|blue|emerald|orange)-)[^>]*>[\s\S]{0,80}?(?:Saved|Active|Pending|Complete|Failed)[\s\S]{0,20}?<\/span>/g],
 ['faint-text','This known white/gray pairing has insufficient normal-text contrast.','Use a measured readable foreground.',/(?:bg-white[^"'\n]{0,160}text-(?:gray|slate|neutral)-(?:200|300)|text-(?:gray|slate|neutral)-(?:200|300)[^"'\n]{0,160}bg-white)/g],
 ['control-radius','Small ordinary controls have oversized rounding.','Use the control role or document a deliberate pill.',/<(?:input|select|textarea)\b[^>]*rounded-3xl/g],
 ['arbitrary-spacing','Repeated exact spacing may bypass the chosen rhythm.','Use spacing roles or explain the optical correction.',/(?:(?:p[xytrbl]?|m[xytrbl]?|gap(?:-[xy])?)-\[(?:13|19|23|27|31)px\][^"'\n]{0,120}){2,}/g],
 ['accent-sprawl','Several expressive hues may compete for attention.','Separate brand expression from labeled domain colors.',/(?:text|bg|border)-(?:red|blue|violet|purple|pink|lime|orange|emerald|green|yellow)-\d+/g],
 ['floating-dock','A decorative floating dock can complicate frequent navigation.','Use stable navigation or explain the tool-palette role.',/<nav\b[^>]*(?=[^>]*fixed)(?=[^>]*bottom-)(?=[^>]*backdrop-blur)[^>]*>/g],
 ['rotated-copy','Essential reading should remain upright.','Keep rotation on short notes or decorative objects.',/<(?:p|input|textarea|label)\b[^>]*(?:-?rotate-(?:[1-9]|\[))/g],
 ['hover-only','Essential controls may be unavailable to touch and keyboard users.','Keep a visible name and keyboard treatment.',/<(?:button|a)\b[^>]*(?=[^>]*opacity-0)(?=[^>]*group-hover:opacity-100)[^>]*>/g],
 ['transition-all','Every-property transitions can animate unwanted layout changes.','Name the actual feedback properties.',/transition\s*:\s*all\b|\btransition-all\b/g],
 ['continuous-decoration','Continuous decorative movement repeatedly takes attention.','Use finite state feedback or document real progress.',/\banimate-(?:bounce|ping)\b|animation\s*:[^;\n]*\binfinite\b/g],
 ['vague-action','A promotional label conceals the resulting action.','Name the result with an ordinary verb.',/<(?:button|Button)\b[^>]*>\s*(?:Unlock your potential|Make magic|Get started with greatness)\s*<\//gi]
];
export function lintText(file,text,{allow=[],maxAccentColors=4}={}){
 const findings=[];
 for(const [id,why,fix,pattern] of rules){
  const hits=[...text.matchAll(new RegExp(pattern.source,pattern.flags))];
  if(id==='accent-sprawl'&&new Set(hits.map(hit=>hit[0].split('-')[1])).size<=maxAccentColors)continue;
  for(const hit of id==='accent-sprawl'?hits.slice(0,1):hits){
   const line=text.slice(0,hit.index).split('\n').length;
   const nearby=text.split('\n').slice(Math.max(0,line-3),line+1).join('\n');
   const inline=new RegExp(`taste-allow\\s+(?:${id}|\\*)\\s+--\\s+\\S`).test(nearby);
   const configured=allow.some(item=>item.file===file&&item.rule===id&&typeof item.reason==='string'&&item.reason.trim().length>0);
   if(inline||configured)continue;
   findings.push({file,line,rule:id,why,suggestedFix:fix,severity:'candidate'});
  }
 }
 return findings;
}
export async function lint(root){
 let config={};try{config=JSON.parse(await readFile(resolve(root,'.flavius-design-lint.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
 const files=await sourceFiles(root);return files.filter(({file})=>/\.(?:jsx|tsx|css|scss)$/.test(file)&&!/(?:^|\/)(?:tokens|fonts)\./.test(file)).flatMap(({file,text})=>lintText(file,text,config));
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const findings=await lint(resolve(argument('--root',process.cwd())));
 for(const issue of findings)console.log(`${issue.file}:${issue.line} ${issue.rule}: ${issue.why} Fix: ${issue.suggestedFix}`);
 if(argument('--output',null))await writeFile(argument('--output'),JSON.stringify({findings,limits:'Lexical heuristics, not an intent or accessibility audit. Deliberate exceptions need a reason.'},null,2)+'\n');
 if(process.argv.includes('--strict')&&findings.length)process.exitCode=1;
}
