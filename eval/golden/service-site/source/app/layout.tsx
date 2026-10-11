import type {ReactNode} from 'react';
import './globals.css';
export const metadata={title:'Site starter',description:'Replace this copy with the site brief.'};
export default function Layout({children}:{children:ReactNode}) {
 return <html lang="en" data-theme="auto"><body>{children}</body></html>;
}
