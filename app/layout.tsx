'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import { addLocale, locale } from 'primereact/api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';

import pt_br from '../public/layout/languages/pt.json';
import { AuthProvider } from '../providers/auth-provider';
import { Suspense } from 'react';
import Loading from './(main)/loading';

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
                <AuthProvider>
                    <PrimeReactProvider>
                        <ToastContainer autoClose={4000} hideProgressBar />
                        <LayoutProvider>{children}</LayoutProvider>
                    </PrimeReactProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
