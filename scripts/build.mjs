import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const base=new URL('../directions/editorial-calm/assets/',import.meta.url);
const tokens=JSON.parse(readFileSync(new URL('../tokens/editorial-calm/tokens.json',import.meta.url),'utf8'));
const personalBase=new URL('../directions/personal-room/assets/',import.meta.url);
export function personalOutputs(){
 const source=JSON.parse(readFileSync(new URL('../tokens/personal-room/tokens.json',import.meta.url),'utf8'));
 const palettes=Object.entries(source.colors).map(([name,roles])=>`${name==='paper'?':root, [data-personal-room="paper"]':'[data-personal-room="night"]'} {\n  color-scheme: ${name==='paper'?'light':'dark'};\n${Object.entries(roles).map(([key,value])=>`  --pr-${key}: ${value};`).join('\n')}\n}`).join('\n\n');
 const dimensions=Object.entries(source).filter(([key])=>key!=='colors').flatMap(([group,values])=>Object.entries(values).map(([key,value])=>`  --pr-${group}-${key}: ${value};`));
 return {'tokens.json':JSON.stringify(source,null,2)+'\n','tokens.css':palettes+'\n\n:root {\n'+dimensions.join('\n')+'\n}\n'};
}
export function srgb(value){
 const match=typeof value === 'string' && value.match(/^oklch\(([\d.]+) ([\d.]+) ([+-]?[\d.]+)(?: \/ ([\d.]+)%)?\)$/);
 if(!match) throw new Error(`Unsupported colour: ${value}`);
 const [,l,c,h,alpha]=match.map(Number);
 if (![l,c,h].every(Number.isFinite) || l<0 || l>1 || c<0 || (match[4]!==undefined && (!Number.isFinite(alpha) || alpha<0 || alpha>100))) throw new Error(`Invalid colour channels: ${value}`);
 const angle=h*Math.PI/180; const a=c*Math.cos(angle), b=c*Math.sin(angle);
 const ll=(l+0.3963377774*a+0.2158037573*b)**3;
 const mm=(l-0.1055613458*a-0.0638541728*b)**3;
 const ss=(l-0.0894841775*a-1.291485548*b)**3;
 const linear=[4.0767416621*ll-3.3077115913*mm+0.2309699292*ss,-1.2684380046*ll+2.6097574011*mm-0.3413193965*ss,-0.0041960863*ll-0.7034186147*mm+1.707614701*ss];
 const channels=linear.map(v=>Math.round(Math.max(0,Math.min(1,v<=0.0031308?12.92*v:1.055*v**(1/2.4)-0.055))*255));
 return '#'+channels.map(v=>v.toString(16).padStart(2,'0')).join('')+(Number.isFinite(alpha)?Math.round(alpha/100*255).toString(16).padStart(2,'0'):'');
}
export function outputs(source=tokens){
 const colors=Object.fromEntries(Object.entries(source.colors).map(([mode,roles])=>[mode,Object.fromEntries(Object.entries(roles).map(([key,value])=>[key,srgb(value)]))]));
 const palette=(selector,mode,roles)=>`${selector} {\n  color-scheme: ${mode};\n${Object.entries(roles).map(([key,value])=>`  --${key}: ${value};`).join('\n')}\n}`;
 const blocks=Object.entries(source.colors).map(([mode,roles])=>palette(source.webTheme[mode],mode,roles)).join('\n\n');
 const automatic=Object.entries(source.colors).map(([mode,roles])=>`@media (prefers-color-scheme: ${mode}) {\n${palette(source.webTheme.automatic,mode,roles).split('\n').map(line=>'  '+line).join('\n')}\n}`).join('\n\n');
 const typeSizes=new Set(['bodyWeb','bodyMobile','section','rowTitle','pageTitle']);
 const typeDimensions=Object.entries(source.type).map(([k,v])=>`  --type-${k}: ${typeSizes.has(k)?`${v/16}rem`:v};`);
 const dimensions=Object.entries(source.spacing).map(([k,v])=>`  --space-${k}: ${v}px;`).concat(Object.entries(source.radius).map(([k,v])=>`  --radius-${k}: ${v}px;`),Object.entries(source.motion).map(([k,v])=>`  --motion-${k}: ${k==='pressScale'?v:`${v}ms`};`),typeDimensions);
 return {'tokens.json':JSON.stringify(source,null,2)+'\n','tokens.css':blocks+'\n\n'+automatic+'\n\n:root {\n'+dimensions.join('\n')+'\n}\n','tokens.srgb.json':JSON.stringify({...source,colors},null,2)+'\n'};
}
export function themeOutputs(source=tokens) {
 const radius=(source.radius.control/16)+'rem';
 const cssVars={theme:{'font-sans':'Inter, system-ui, sans-serif'},light:{...source.colors.light,radius},dark:{...source.colors.dark,radius}};
 const theme={"$schema":"https://ui.shadcn.com/schema/registry-item.json",name:'editorial-calm',type:'registry:theme',title:'Editorial calm',description:'Warm neutral roles, graphite actions and visible input boundaries.',cssVars};
 const aliases=Object.keys(source.colors.light).map(key=>`  --color-${key}: var(--${key});`);
 const tailwind=`@theme inline {\n${aliases.join('\n')}\n  --radius-sm: calc(var(--radius) - 4px);\n  --radius-md: calc(var(--radius) - 2px);\n  --radius-lg: var(--radius);\n  --radius-xl: calc(var(--radius) + 4px);\n}\n:root { --radius: ${radius}; }\n`;
 return {'editorial-calm.theme.css':tailwind,'editorial-calm.shadcn.json':JSON.stringify(cssVars,null,2)+'\n','editorial-calm.json':JSON.stringify(theme,null,2)+'\n'};
}
export function writeExports(){
 const root=new URL('../',import.meta.url);
 mkdirSync(new URL('tokens/exports/',root),{recursive:true});mkdirSync(new URL('registry/r/',root),{recursive:true});
 const generated=themeOutputs();
 for(const [name,value] of Object.entries(generated))writeFileSync(new URL('tokens/exports/'+name,root),value);
 writeFileSync(new URL('registry/r/editorial-calm.json',root),generated['editorial-calm.json']);
 writeFileSync(new URL('registry/registry.json',root),JSON.stringify({"$schema":"https://ui.shadcn.com/schema/registry.json",name:'flavius-design',homepage:'https://github.com/flvvius/flavius-design-taste',items:[JSON.parse(generated['editorial-calm.json'])]},null,2)+'\n');
 const starter=new URL('skills/flavius-design/assets/starter/app/',root);
 writeFileSync(new URL('tokens.css',starter),outputs()['tokens.css']);writeFileSync(new URL('theme.css',starter),generated['editorial-calm.theme.css']);
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 for(const [name,value] of Object.entries(outputs()))writeFileSync(new URL(name,base),value);
 for(const [name,value] of Object.entries(personalOutputs()))writeFileSync(new URL(name,personalBase),value);
 writeExports();
}
