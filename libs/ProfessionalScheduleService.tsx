import { ProfessionalSchedule } from '../types/professional';

async function createProfessionalSchedule(professionalSchedule: ProfessionalSchedule) {
    const response = await fetch('/api/professionalschedules', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(professionalSchedule)
    });

    const error = response.status != 201 ? 'Erro ao incluir horários do profissional' : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function updateProfessionalSchedule(professionalSchedule: ProfessionalSchedule) {
    const response = await fetch('/api/professionalschedules', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(professionalSchedule)
    });

    const error = !response.ok ? 'Erro ao atualizar horários do profissional' : false;
    const data = error ? null : await response.json();
    return { error, data };
}

export { createProfessionalSchedule, updateProfessionalSchedule };
