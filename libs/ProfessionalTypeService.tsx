import { ProfessionalType } from '../types/professional';

async function getProfessionalTypes() {
    //Lista apenas os tipos de profissionais ativos
    const response = await fetch('/api/professionaltypes?active=true');

    if (!response.ok) {
        throw new Error('Erro ao buscar tipos de profissional');
    }
    return await response.json();
}

async function createProfessionalType(professionalType: ProfessionalType) {
    const response = await fetch('/api/professionaltypes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(professionalType)
    });

    if (response.status != 201) {
        throw new Error('Erro ao incluir tipo de profissional');
    }
    return await response.json();
}

export { getProfessionalTypes, createProfessionalType };
