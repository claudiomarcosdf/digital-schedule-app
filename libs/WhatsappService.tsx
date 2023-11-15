import { FileMessage } from '../types/whatsapp';

async function getMessageError(response: Response, messageDefault: string) {
    const objError = (await response?.text()).trim();
    return objError || messageDefault;
}

async function getInstanceInfoApi() {
    const response = await fetch(`/api/whatsapp/instanceinfo`);

    const error = !response.ok ? await getMessageError(response, 'A conexão com o whatsapp falhou') : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function getQRCodeApi() {
    const response = await fetch(`/api/whatsapp/qrcode`);

    const error = !response.ok ? await getMessageError(response, 'A conexão com o whatsapp falhou') : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function getDefaultMessage(messageType: string) {
    const response = await fetch(`/api/whatsapp/filemessage/${messageType}`);

    const error = !response.ok ? await getMessageError(response, 'Não foi possível consultar mensagem') : false;
    const data = error ? null : (await response?.text()).trim();
    return { error, data };
}

async function saveDefaultMessage(fileMessage: FileMessage) {
    const response = await fetch(`/api/whatsapp/filemessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fileMessage)
    });

    const error = !response.ok ? 'Não foi possível salvar a mensagem' : false;
    //const data = error ? null : await response.json();
    return { error };
}

export { getInstanceInfoApi, getQRCodeApi, getDefaultMessage, saveDefaultMessage };
