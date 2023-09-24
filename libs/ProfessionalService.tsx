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

    if (response.status != 201) {
        throw new Error('Erro ao incluir profissional');
    }
    return await response.json();
}

async function updateProfessional(professional: Professional) {
    const response = await fetch('/api/professionals', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(professional)
    });

    if (!response.ok) {
        throw new Error('Erro ao atualizar profissional');
    }
    return await response.json();
}

async function deleteProfessional(professional: Professional) {
    const response = await fetch('/api/professionals/' + professional.id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Erro ao excluir profissional');
    }
}

export { getProfessionals, createProfessional, updateProfessional, deleteProfessional };
