'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import { addLocale, locale } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';

import pt_br from '../public/layout/languages/pt.json';

interface RootLayoutProps {
    children: React.ReactNode;
}

addLocale('pt', { ...pt_br.pt });
locale('pt');

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/saga-purple/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <PrimeReactProvider>
                    <LayoutProvider>{children}</LayoutProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
