import {Hero} from '../../Hero';
export default async function Page({params}:{params:Promise<{option:string}>}){const {option}=await params;return <main><header className="site-head"><a href="/">Flavius Cojocaru</a><span>Composition {option.toUpperCase()}, draft</span></header><Hero option={option}/><a href="/" className="option-back">See the complete chosen page</a></main>}
