import { Procedure } from '../types/procedure';

async function getAllProceduresByProfessionalType(professionalTypeId: number) {
    const response = await fetch('/api/procedures/professionaltype/' + professionalTypeId);

    if (!response.ok) {
        throw new Error('Erro ao buscar procedimentos do tipo de profissional');
    }
    return await response.json();
}

async function getActiveProceduresByProfessionalType(professionalTypeId: number) {
    const response = await fetch('/api/procedures/activeprofessionaltype/' + professionalTypeId);

    if (!response.ok) {
        throw new Error('Erro ao buscar procedimentos ativos do tipo de profissional');
    }
    return await response.json();
}

async function createProcedure(procedure: Procedure) {
    const response = await fetch('/api/procedures', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(procedure)
    });

    // if (response.status != 201) {
    //     throw new Error('Erro ao incluir procedimento');
    // }
    // return await response.json();

    const error = response.status != 201 ? 'Erro ao incluir procedimento' : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function updateProcedure(procedure: Procedure) {
    const response = await fetch('/api/procedures', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(procedure)
    });

    const error = !response.ok ? 'Erro ao atualizar procedimento' : false;
    const data = error ? null : await response.json();
    return { error, data };
}

async function removeProcedure(procedure: Procedure) {
    const response = await fetch('/api/procedures/' + procedure.id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const error = !response.ok ? 'Erro ao excluir procedimento' : false;
    return { error };
}

export { getAllProceduresByProfessionalType, getActiveProceduresByProfessionalType, createProcedure, updateProcedure, removeProcedure };
