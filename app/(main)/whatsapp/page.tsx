'use client';
import React, { useEffect, useState } from 'react';
import { useWhatsappStore } from '../../../store/WhatsappStore';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import BlockCard from '../../../common/BlockCard';

type boxCardType = {
    image: string;
    message: string;
    user: string | null;
};

const WhatsappPage = () => {
    const { instanceInfo, getInstanceInfo, qrCode, getQRCode } = useWhatsappStore((state) => state);

    const [boxCard, setBoxCard] = useState<boxCardType>({
        image: !instanceInfo?.user ? '/layout/qrcode/cross.svg' : '/layout/qrcode/check.svg',
        message: !instanceInfo?.user ? 'Desconectado' : 'Conectado!!!',
        user: !instanceInfo?.user ? '' : instanceInfo.user
    });

    useEffect(() => {
        //const time = instanceInfo?.user ? 60000 : 5000;
        const interval = setInterval(() => {
            getInstanceInfo();
            refreshBoxCard();
        }, 5000); //5 sec

        return () => clearInterval(interval);
    }, [instanceInfo, qrCode]);

    const onGetQRCode = () => {
        const user: string | null | undefined = instanceInfo ? (instanceInfo?.user ? instanceInfo.user : '') : '';

        if (!user) {
            setBoxCard({ ...boxCard, image: '/layout/qrcode/loader.gif', message: 'Solicitando QRCode...', user: '' });
            getQRCode();
        }
    };

    const cardHeader = (
        <div className="flex align-items-center justify-content-between mb-0 p-3 pb-0" style={{ backgroundColor: '#00a884' }}>
            <h5 className="m-0 mb-2 text-white">WHATSAPP QRCODE</h5>
            <Button className="mb-2 text-white" icon="pi pi-fw pi-sync" text onClick={onGetQRCode} tooltip="Pegar novo QRCode" tooltipOptions={{ position: 'bottom' }} />
        </div>
    );

    const refreshBoxCard = () => {
        const user: string | null | undefined = instanceInfo ? (instanceInfo?.user ? instanceInfo.user : '') : '';

        //if (!user) console.log('No user ');
        //console.log('imagem qr ', qrCode?.image);

        if (qrCode?.image) {
            //console.log('print qr code');
            setBoxCard({ ...boxCard, image: qrCode?.image, message: 'Leia o QR Code acima usando seu aplicativo WhatsApp.', user: '' });
        } else if (!instanceInfo || !user) {
            //console.log('print desconectado');
            setBoxCard({ ...boxCard, image: '/layout/qrcode/cross.svg', message: 'Desconectado', user: '' });
        } else if (user) {
            //console.log('print user conectado');
            setBoxCard({ ...boxCard, image: '/layout/qrcode/check.svg', message: 'Conectado!!!', user: user });
        }
    };

    //instanceInfo && refreshBoxCard();

    return (
        <div className="grid">
            <div className="col-12">
                <BlockCard header="Conexão com o Whatsapp" subtitle="Vinculação do sistema ao Whatsapp da empresa" containerClassName="px-4 py-8 md:px-6 lg:px-8">
                    <div className="flex align-items-center justify-content-center">
                        <Card header={cardHeader} className="surface-card border-round shadow-2 w-full lg:w-6" style={{ border: '0.5px solid #c8e2d6' }}>
                            <div id="qrcode-container">
                                <img src={boxCard.image} alt="qrcode" id="qrcode" style={{ width: '250px' }} />
                                <p className="line-height-3 m-0 font-semibold">{boxCard.message}</p>
                                <span>{boxCard.user}</span>
                            </div>
                        </Card>
                    </div>
                </BlockCard>
            </div>
        </div>
    );
};

export default WhatsappPage;
