import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const base=new URL('../skills/editorial-calm/assets/',import.meta.url);
const tokens=JSON.parse(readFileSync(new URL('tokens.json',base),'utf8'));
const personalBase=new URL('../skills/personal-room/assets/',import.meta.url);
export function personalOutputs(){
 const source=JSON.parse(readFileSync(new URL('tokens.json',personalBase),'utf8'));
 const palettes=Object.entries(source.colors).map(([name,roles])=>`${name==='paper'?':root, [data-personal-room="paper"]':'[data-personal-room="night"]'} {\n  color-scheme: ${name==='paper'?'light':'dark'};\n${Object.entries(roles).map(([key,value])=>`  --pr-${key}: ${value};`).join('\n')}\n}`).join('\n\n');
 const dimensions=Object.entries(source).filter(([key])=>key!=='colors').flatMap(([group,values])=>Object.entries(values).map(([key,value])=>`  --pr-${group}-${key}: ${value};`));
 return {'tokens.css':palettes+'\n\n:root {\n'+dimensions.join('\n')+'\n}\n'};
}
export function srgb(value){
 const match=value.match(/oklch\(([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+)%)?\)/);
 if(!match) throw new Error(`Unsupported colour: ${value}`);
 const [,l,c,h,alpha]=match.map(Number); const angle=h*Math.PI/180; const a=c*Math.cos(angle), b=c*Math.sin(angle);
 const ll=(l+0.3963377774*a+0.2158037573*b)**3;
 const mm=(l-0.1055613458*a-0.0638541728*b)**3;
 const ss=(l-0.0894841775*a-1.291485548*b)**3;
 const linear=[4.0767416621*ll-3.3077115913*mm+0.2309699292*ss,-1.2684380046*ll+2.6097574011*mm-0.3413193965*ss,-0.0041960863*ll-0.7034186147*mm+1.707614701*ss];
 const channels=linear.map(v=>Math.round(Math.max(0,Math.min(1,v<=0.0031308?12.92*v:1.055*v**(1/2.4)-0.055))*255));
 return '#'+channels.map(v=>v.toString(16).padStart(2,'0')).join('')+(Number.isFinite(alpha)?Math.round(alpha/100*255).toString(16).padStart(2,'0'):'');
}
export function outputs(){
 const colors=Object.fromEntries(Object.entries(tokens.colors).map(([mode,roles])=>[mode,Object.fromEntries(Object.entries(roles).map(([key,value])=>[key,srgb(value)]))]));
 const blocks=Object.entries(tokens.colors).map(([mode,roles])=>`${mode==='light'?':root':'.dark'} {\n  color-scheme: ${mode};\n${Object.entries(roles).map(([k,v])=>`  --${k}: ${v};`).join('\n')}\n}`).join('\n\n');
 const typeSizes=new Set(['bodyWeb','bodyMobile','section','rowTitle','pageTitle']);
 const typeDimensions=Object.entries(tokens.type).map(([k,v])=>`  --type-${k}: ${typeSizes.has(k)?`${v/16}rem`:v};`);
 const dimensions=Object.entries(tokens.spacing).map(([k,v])=>`  --space-${k}: ${v}px;`).concat(Object.entries(tokens.radius).map(([k,v])=>`  --radius-${k}: ${v}px;`),Object.entries(tokens.motion).map(([k,v])=>`  --motion-${k}: ${k==='pressScale'?v:`${v}ms`};`),typeDimensions);
 return {'tokens.css':blocks+'\n\n:root {\n'+dimensions.join('\n')+'\n}\n','tokens.srgb.json':JSON.stringify({...tokens,colors},null,2)+'\n'};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 for(const [name,value] of Object.entries(outputs()))writeFileSync(new URL(name,base),value);
 for(const [name,value] of Object.entries(personalOutputs()))writeFileSync(new URL(name,personalBase),value);
}
