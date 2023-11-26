import { ProfessionalSchedule } from '../types/professional';
import { headerAuthorizationToken } from './auth';

const pathNextToApiDigitalSchedule = '/api-schedule'; // para o next nao confundir com /api/auth...

async function createProfessionalSchedule(professionalSchedule: ProfessionalSchedule) {
    const { headers } = await headerAuthorizationToken();

    const response = await fetch(pathNextToApiDigitalSchedule + '/professionalschedules', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(professionalSchedule)
    });

    const error = response.status != 201 ? 'Erro ao incluir horários do profissional' : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function updateProfessionalSchedule(professionalSchedule: ProfessionalSchedule) {
    const { headers } = await headerAuthorizationToken();

    const response = await fetch(pathNextToApiDigitalSchedule + '/professionalschedules', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(professionalSchedule)
    });

    const error = !response.ok ? 'Erro ao atualizar horários do profissional' : false;
    const data = error ? null : await response.json();
    return { error, data };
}

export { createProfessionalSchedule, updateProfessionalSchedule };
