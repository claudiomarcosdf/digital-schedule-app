import { ProfessionalSchedule } from '../types/professional';

async function createProfessionalSchedule(professionalSchedule: ProfessionalSchedule) {
    const response = await fetch('/api/professionalschedules', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(professionalSchedule)
    });

    if (response.status != 201) {
        throw new Error('Erro ao incluir horários do profissional');
    }
    return await response.json();
}

async function updateProfessionalSchedule(professionalSchedule: ProfessionalSchedule) {
    const response = await fetch('/api/professionalschedules', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(professionalSchedule)
    });

    if (!response.ok) {
        throw new Error('Erro ao atualizar horários do profissional');
    }
    return await response.json();
}

export { createProfessionalSchedule, updateProfessionalSchedule };
