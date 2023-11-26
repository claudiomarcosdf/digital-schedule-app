import { PersonType } from '../types/person';
import { headerAuthorizationToken } from './auth';

const pathNextToApiDigitalSchedule = '/api-schedule'; // para o next nao confundir com /api/auth...

async function getPersonTypes() {
    const defaultOptions = await headerAuthorizationToken();
    const response = await fetch(pathNextToApiDigitalSchedule + '/persontypes', defaultOptions);

    if (!response.ok) {
        throw new Error('Erro ao buscar tipos de pessoa');
    }
    return await response.json();
}

async function createPersonType(personType: PersonType) {
    const { headers } = await headerAuthorizationToken();

    const response = await fetch(pathNextToApiDigitalSchedule + '/persontypes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(personType)
    });

    if (!response.ok) {
        throw new Error('Erro ao incluir tipo de pessoa');
    }
    return await response.json();
}

export { getPersonTypes, createPersonType };
