import { Professional } from '../types/professional';
import { headerAuthorizationToken } from './auth';

const pathNextToApiDigitalSchedule = '/api-schedule'; // para o next nao confundir com /api/auth...

async function getProfessionals() {
    const defaultOptions = await headerAuthorizationToken();

    const response = await fetch(pathNextToApiDigitalSchedule + '/professionals', defaultOptions);

    if (!response.ok) {
        throw new Error('Erro ao buscar profissionais');
    }
    return await response.json();
}

// headers: {
//     'Content-Type': 'application/json',
//     'API-Key': process.env.DATA_API_KEY
// },

async function createProfessional(professional: Professional) {
    const { headers } = await headerAuthorizationToken();

    const response = await fetch(pathNextToApiDigitalSchedule + '/professionals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(professional)
    });

    const error = response.status != 201 ? 'Erro ao incluir profissional' : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function updateProfessional(professional: Professional) {
    const { headers } = await headerAuthorizationToken();

    const response = await fetch(pathNextToApiDigitalSchedule + '/professionals', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(professional)
    });

    const error = !response.ok ? 'Erro ao atualizar profissional' : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function deleteProfessional(professional: Professional) {
    const { headers } = await headerAuthorizationToken();

    const response = await fetch(pathNextToApiDigitalSchedule + '/professionals/' + professional.id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    });

    const error = !response.ok ? 'Erro ao excluir profissional' : false;
    return { error };
}

async function getProfessionalsByType(professionalTypeId: number) {
    const defaultOptions = await headerAuthorizationToken();

    const response = await fetch(pathNextToApiDigitalSchedule + '/professionals/professionaltype/' + professionalTypeId, defaultOptions);

    if (!response.ok) {
        throw new Error('Erro ao listar profissionais pelo tipo');
    }
    return await response.json();
}

export { getProfessionals, createProfessional, updateProfessional, deleteProfessional, getProfessionalsByType };
