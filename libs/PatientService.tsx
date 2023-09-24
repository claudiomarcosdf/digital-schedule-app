import { Patient } from '../types/patient';

async function getPatients() {
    const response = await fetch('/api/patients');

    if (!response.ok) {
        throw new Error('Erro ao buscar pacientes');
    }
    return await response.json();
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

    if (response.status != 201) {
        throw new Error('Erro ao incluir paciente');
    }
    return await response.json();
}

async function updatePatient(patient: Patient) {
    const response = await fetch('/api/patients', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patient)
    });

    if (!response.ok) {
        throw new Error('Erro ao atualizar paciente');
    }
    return await response.json();
}

async function deletePatient(patient: Patient) {
    const response = await fetch('/api/patients/' + patient.id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Erro ao excluir paciente');
    }
}

export { getPatients, createPatient, updatePatient, deletePatient };
