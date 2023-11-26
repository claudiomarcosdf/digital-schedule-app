import { FileMessage } from '../types/whatsapp';
import { headerAuthorizationToken } from './auth';

const pathNextToApiDigitalSchedule = '/api-schedule'; // para o next nao confundir com /api/auth...

async function getMessageError(response: Response, messageDefault: string) {
    const objError = (await response?.text()).trim();
    return objError || messageDefault;
}

async function getInstanceInfoApi() {
    const defaultOptions = await headerAuthorizationToken();

    const response = await fetch(`${pathNextToApiDigitalSchedule}/whatsapp/instanceinfo`, defaultOptions);

    const error = !response.ok ? await getMessageError(response, 'A conexão com o whatsapp falhou') : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function getQRCodeApi() {
    const defaultOptions = await headerAuthorizationToken();

    const response = await fetch(`${pathNextToApiDigitalSchedule}/whatsapp/qrcode`, defaultOptions);

    const error = !response.ok ? await getMessageError(response, 'A conexão com o whatsapp falhou') : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function getDefaultMessage(messageType: string) {
    const defaultOptions = await headerAuthorizationToken();

    const response = await fetch(`${pathNextToApiDigitalSchedule}/whatsapp/filemessage/${messageType}`, defaultOptions);

    const error = !response.ok ? await getMessageError(response, 'Não foi possível consultar mensagem') : false;
    const data = error ? null : (await response?.text()).trim();
    return { error, data };
}

async function saveDefaultMessage(fileMessage: FileMessage) {
    const { headers } = await headerAuthorizationToken();

    const response = await fetch(`${pathNextToApiDigitalSchedule}/whatsapp/filemessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(fileMessage)
    });

    const error = !response.ok ? 'Não foi possível salvar a mensagem' : false;
    //const data = error ? null : await response.json();
    return { error };
}

export { getInstanceInfoApi, getQRCodeApi, getDefaultMessage, saveDefaultMessage };
