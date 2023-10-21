import { Patient } from '../types/patient';

async function getPatients() {
    const response = await fetch('/api/patients');

    if (!response.ok) {
        throw new Error('Erro ao listar pacientes');
    }
    return await response.json();
}

async function findPatientsByName(name: string) {
    const response = await fetch('/api/patients/name/' + name);

    const error = !response.ok ? 'Erro ao buscar paciente' : false;
    const data = error ? null : await response.json();
    return { error, data };
}

// headers: {
//     'Content-Type': 'application/json',
//     'API-Key': process.env.DATA_API_KEY
// },

async function createPatient(patient: Patient) {
    const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patient)
    });

    const error = response.status != 201 ? 'Erro ao incluir paciente' : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function updatePatient(patient: Patient) {
    const response = await fetch('/api/patients', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patient)
    });

    const error = !response.ok ? 'Erro ao atualizar paciente' : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function deletePatient(patient: Patient) {
    const response = await fetch('/api/patients/' + patient.id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const error = !response.ok ? 'Erro ao excluir paciente' : false;
    return { error };
}

export { getPatients, findPatientsByName, createPatient, updatePatient, deletePatient };
