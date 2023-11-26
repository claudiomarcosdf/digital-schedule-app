import { Schedule, ScheduleRequest } from '../types/schedule';
import { headerAuthorizationToken } from './auth';

const pathNextToApiDigitalSchedule = '/api-schedule'; // para o next nao confundir com /api/auth...

async function getSchedulesByProfessional(professionalTypeId: number, professionalId: number, startDate: string, endDate: string) {
    const defaultOptions = await headerAuthorizationToken();

    const response = await fetch(`${pathNextToApiDigitalSchedule}/schedules?professionalTypeId=${professionalTypeId}&professionalId=${professionalId}&startDate=${startDate}&endDate=${endDate}`, defaultOptions);

    if (!response.ok) {
        throw new Error('Erro ao listar agendas do profissional');
    }
    return await response.json();
}

async function getMessageError(response: Response, messageDefault: string) {
    const objError = await response.json();

    if (response.status == 409) return 'Já existe agendamento para este horário!';

    return objError?.message || messageDefault;
}

async function createSchedule(schedule: ScheduleRequest) {
    const { headers } = await headerAuthorizationToken();

    const response = await fetch(pathNextToApiDigitalSchedule + '/schedules', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(schedule)
    });

    const error = response.status != 201 ? await getMessageError(response, 'Erro ao incluir agendamento') : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function updateSchedule(schedule: ScheduleRequest) {
    const { headers } = await headerAuthorizationToken();

    const response = await fetch(pathNextToApiDigitalSchedule + '/schedules', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(schedule)
    });

    const error = !response.ok ? await getMessageError(response, 'Erro ao atualizar agendamento') : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function deleteSchedule(schedule: Schedule) {
    const { headers } = await headerAuthorizationToken();

    const response = await fetch(pathNextToApiDigitalSchedule + '/schedules/' + schedule.id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    });

    const error = !response.ok ? 'Erro ao excluir agendamento' : false;
    return { error };
}

async function sendConfirmation(date: string) {
    const { headers } = await headerAuthorizationToken();

    const response = await fetch(`${pathNextToApiDigitalSchedule}/schedules/sendconfirmation?scheduleDate=${date}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    });

    const error = !response.ok ? 'A conexão com o whatsapp falhou' : false;
    const data = error ? null : (await response?.text()).trim();
    return { error, data };
}

export { getSchedulesByProfessional, createSchedule, updateSchedule, deleteSchedule, sendConfirmation };
