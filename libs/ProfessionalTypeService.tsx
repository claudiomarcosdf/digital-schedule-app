import { ProfessionalType } from '../types/professional';
import { headerAuthorizationToken } from './auth';

const pathNextToApiDigitalSchedule = '/api-schedule'; // para o next nao confundir com /api/auth...

async function getProfessionalTypes() {
    const defaultOptions = await headerAuthorizationToken();

    //Lista apenas os tipos de profissionais ativos
    const response = await fetch(pathNextToApiDigitalSchedule + '/professionaltypes?active=true', defaultOptions);

    if (!response.ok) {
        throw new Error('Erro ao buscar tipos de profissional');
    }
    return await response.json();
}

async function createProfessionalType(professionalType: ProfessionalType) {
    const { headers } = await headerAuthorizationToken();

    const response = await fetch(pathNextToApiDigitalSchedule + '/professionaltypes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(professionalType)
    });

    if (response.status != 201) {
        throw new Error('Erro ao incluir tipo de profissional');
    }
    return await response.json();
}

export { getProfessionalTypes, createProfessionalType };
