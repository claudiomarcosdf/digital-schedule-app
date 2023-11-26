/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import React, { useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext, LayoutProvider } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { ProgressBar } from 'primereact/progressbar';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [error, setError] = useState('');
    const { layoutConfig } = useContext(LayoutContext);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await signIn('credentials', {
                redirect: false,
                email,
                password
            });
            console.log('LOGIN_RESPONSE ', response);
            setLoading(false);

            if (!response?.error) {
                router.refresh();
                router.push('/');
            } else {
                setError('Email ou senha inválidos');
            }
        } catch (error) {
            console.log('LOGIN_ERROR ', error);
        }
    };

    return (
        <LayoutProvider>
            {loading ? <ProgressBar mode="indeterminate" style={{ height: '5px' }}></ProgressBar> : null}
            <div className={containerClassName}>
                <div className="flex flex-column align-items-center justify-content-center">
                    <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                    <div
                        style={{
                            borderRadius: '56px',
                            padding: '0.3rem',
                            background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                        }}
                    >
                        <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                            <div className="text-center mb-5">
                                <img src="/images/access/asset-access.svg" alt="Image" height="50" className="mb-3" />
                                <div className="text-900 text-3xl font-medium mb-3">Agend@Digital</div>
                                <span className="text-600 font-medium">Faça o login para entrar</span>
                            </div>
                            <form onSubmit={handleLogin}>
                                <div>
                                    <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                        Email
                                    </label>
                                    <InputText id="email1" type="text" placeholder="Seu email" onChange={(e) => setEmail(e.target.value)} className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                                    <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                        Senha
                                    </label>
                                    <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                                    {error && (
                                        <div className="box-error">
                                            <span className="text-red-700">{error}</span>
                                        </div>
                                    )}
                                    <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                        <div className="flex align-items-center">
                                            <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                            <label htmlFor="rememberme1">Relembrar senha</label>
                                        </div>
                                        <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                            Esqueceu sua senha?
                                        </a>
                                    </div>
                                    <Button label={loading ? 'Entrando...' : 'Entrar'} className="w-full p-3 text-xl" disabled={loading ? true : false} type="submit"></Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutProvider>
    );
};

export default LoginPage;
