import { PatientType } from '../types/patient';

async function getPersonTypes() {
    const response = await fetch('/api/persontypes');

    if (!response.ok) {
        throw new Error('Erro ao buscar tipos de pessoa');
    }
    return await response.json();
}

async function createPersonType(personType: PatientType.PersonType) {
    const response = await fetch('/api/persontypes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(personType)
    });

    if (!response.ok) {
        throw new Error('Erro ao incluir paciente');
    }
    return await response.json();
}

export { getPersonTypes, createPersonType };
