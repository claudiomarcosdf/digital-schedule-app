import { PatientType } from '../types/patient';

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

async function createPatient(patient: PatientType.Patient) {
    const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patient)
    });

    if (!response.ok) {
        throw new Error('Erro ao incluir paciente');
    }
    return await response.json();
}

export { getPatients, createPatient };
