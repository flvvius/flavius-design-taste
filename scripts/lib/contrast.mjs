export function luminance(hex) {
  const channels = hex.slice(1,7).match(/../g).map(v=>parseInt(v,16)/255);
  return channels.map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[0.2126,0.7152,0.0722][i],0);
}
export function contrast(a,b) {
  const l1=luminance(a),l2=luminance(b);
  return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);
}
