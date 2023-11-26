'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import React from 'react';

const DefaultPage = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const goToLogin = () => {
        typeof window !== 'undefined' && (router.refresh(), router.push('/auth/login'));
    };

    return (
        <>
            {session ? (
                <div className="grid">
                    <div className="col-12">
                        <div className="card">
                            <h5>Default Page</h5>
                            <p>Use this page to start from scratch and place your custom content.</p>
                        </div>
                        {session && <pre>{JSON.stringify(session, null, 2)}</pre>}
                    </div>
                </div>
            ) : (
                goToLogin()
            )}
        </>
    );
};

export default DefaultPage;
