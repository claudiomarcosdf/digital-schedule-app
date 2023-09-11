async function getPatients() {
    const response = await fetch('/api/patients');

    if (!response.ok) {
        throw new Error('Erro ao buscar pacientes');
    }
    return await response.json();
}

export { getPatients };
