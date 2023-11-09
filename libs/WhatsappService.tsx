async function getMessageError(response: Response, messageDefault: string) {
    const objError = (await response?.text()).trim();
    return objError || messageDefault;
}

async function getInstanceInfoApi() {
    const response = await fetch(`/api/whatsapp/instanceinfo`);

    const error = !response.ok ? await getMessageError(response, 'Conexão com o whatsapp falhou') : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function getQRCodeApi() {
    const response = await fetch(`/api/whatsapp/qrcode`);

    const error = !response.ok ? await getMessageError(response, 'Conexão com o whatsapp falhou') : false;
    const data = error ? null : await response.json();
    return { error, data };
}

export { getInstanceInfoApi, getQRCodeApi };
