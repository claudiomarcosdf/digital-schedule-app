import { Patient } from '../types/patient';
import { headerAuthorizationToken } from './auth';

const pathNextToApiDigitalSchedule = '/api-schedule'; // para o next nao confundir com /api/auth...

async function getPatients() {
    const defaultOptions = await headerAuthorizationToken();
    const response = await fetch(pathNextToApiDigitalSchedule + '/patients', defaultOptions);

    if (!response.ok) {
        throw new Error('Erro ao listar pacientes');
    }
    return await response.json();
}

async function findPatientsByName(name: string) {
    const defaultOptions = await headerAuthorizationToken();
    const response = await fetch(pathNextToApiDigitalSchedule + '/patients/name/' + name, defaultOptions);

    const error = !response.ok ? 'Erro ao buscar paciente' : false;
    const data = error ? null : await response.json();
    return { error, data };
}

// headers: {
//     'Content-Type': 'application/json',
//     'API-Key': process.env.DATA_API_KEY
// },

async function createPatient(patient: Patient) {
    const { headers } = await headerAuthorizationToken();

    const response = await fetch(pathNextToApiDigitalSchedule + '/patients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(patient)
    });

    const error = response.status != 201 ? 'Erro ao incluir paciente' : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function updatePatient(patient: Patient) {
    const { headers } = await headerAuthorizationToken();

    const response = await fetch(pathNextToApiDigitalSchedule + '/patients', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(patient)
    });

    const error = !response.ok ? 'Erro ao atualizar paciente' : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function deletePatient(patient: Patient) {
    const { headers } = await headerAuthorizationToken();

    const response = await fetch(pathNextToApiDigitalSchedule + '/patients/' + patient.id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    });

    const error = !response.ok ? 'Erro ao excluir paciente' : false;
    return { error };
}

export { getPatients, findPatientsByName, createPatient, updatePatient, deletePatient };
