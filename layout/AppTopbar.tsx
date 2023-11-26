/* eslint-disable @next/next/no-img-element */

import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import { AppTopbarRef } from '../types/types';
import { LayoutContext } from './context/layoutcontext';
import { useWhatsappStore } from '../store/WhatsappStore';
import { Tooltip } from 'primereact/tooltip';
import { Menu } from 'primereact/menu';
import { SignOut } from '../app/(full-page)/auth/sign-out/sign-out';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const menuRight = useRef(null);

    const items = [
        {
            label: 'Usuário',
            items: [
                {
                    label: 'Perfil',
                    icon: 'pi pi-user-edit',
                    command: () => {}
                }
            ]
        },
        { separator: true },
        {
            label: 'Sair',
            icon: 'pi pi-external-link',
            command: () => {
                console.log('sair');
                SignOut();
            }
        }
    ];

    const { instanceInfo } = useWhatsappStore((state) => state);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const getInstanceInfo = () => {
        if (instanceInfo && instanceInfo?.error) return '';

        return instanceInfo ? (instanceInfo.user ? instanceInfo.user : instanceInfo.message) : '';
    };

    const handleMenuClick = (event: any) => {
        // @ts-ignore comment
        menuRight?.current?.toggle(event);
    };

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" />
                <span>AGEND@DIGITAL</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <Link href="/paginas/agenda">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                </Link>

                <Menu model={items} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
                <button type="button" className="p-link layout-topbar-button" onClick={(event) => handleMenuClick(event)} aria-controls="popup_menu_right" aria-haspopup>
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                <Tooltip target=".zap" style={{ width: 'auto' }} position="left">
                    {getInstanceInfo() || 'Desconectado'}
                </Tooltip>
                <Link href="/whatsapp">
                    <button type="button" className={`zap p-link layout-topbar-button ${getInstanceInfo() && 'text-green-500'}`}>
                        <i className="pi pi-fw pi-whatsapp"></i>
                        <span>Whatsapp</span>
                    </button>
                </Link>
                {/* <Link href="/documentation">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-cog"></i>
                        <span>Settings</span>
                    </button>
                </Link>                 */}
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
