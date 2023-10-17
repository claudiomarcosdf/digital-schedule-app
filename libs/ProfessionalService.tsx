import { Professional } from '../types/professional';

async function getProfessionals() {
    const response = await fetch('/api/professionals');

    if (!response.ok) {
        throw new Error('Erro ao buscar profissionais');
    }
    return await response.json();
}

// headers: {
//     'Content-Type': 'application/json',
//     'API-Key': process.env.DATA_API_KEY
// },

async function createProfessional(professional: Professional) {
    const response = await fetch('/api/professionals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(professional)
    });

    const error = response.status != 201 ? 'Erro ao incluir profissional' : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function updateProfessional(professional: Professional) {
    const response = await fetch('/api/professionals', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(professional)
    });

    const error = !response.ok ? 'Erro ao atualizar profissional' : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function deleteProfessional(professional: Professional) {
    const response = await fetch('/api/professionals/' + professional.id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const error = !response.ok ? 'Erro ao excluir profissional' : false;
    return { error };
}

async function getProfessionalsByType(professionalTypeId: number) {
    const response = await fetch('/api/professionals/professionaltype/' + professionalTypeId);

    if (!response.ok) {
        throw new Error('Erro ao listar profissionais pelo tipo');
    }
    return await response.json();
}

export { getProfessionals, createProfessional, updateProfessional, deleteProfessional, getProfessionalsByType };
