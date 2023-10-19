import { Schedule } from '../types/schedule';

async function getSchedulesByProfessional(professionalTypeId: number, professionalId: number, startDate: string, endDate: string) {
    const response = await fetch(`/api/schedules?professionalTypeId=${professionalTypeId}&professionalId=${professionalId}&startDate=${startDate}&endDate=${endDate}`);

    if (!response.ok) {
        throw new Error('Erro ao listar agendas do profissional');
    }
    return await response.json();
}

async function createSchedule(schedule: Schedule) {
    const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(schedule)
    });

    const error = response.status != 201 ? 'Erro ao incluir agendamento' : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function updateSchedule(schedule: Schedule) {
    const response = await fetch('/api/schedules', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(schedule)
    });

    const error = !response.ok ? 'Erro ao atualizar agendamento' : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function deleteSchedule(schedule: Schedule) {
    const response = await fetch('/api/schedules/' + schedule.id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const error = !response.ok ? 'Erro ao excluir agendamento' : false;
    return { error };
}

export { getSchedulesByProfessional, createSchedule, updateSchedule, deleteSchedule };
