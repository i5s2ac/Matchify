import {
    findAllCandidatosByEmpresa,
    findCandidatoById,
    updateCandidatoStatus,
    applyToJobOffer,
    checkApplication,
    getApplicationCountsByStatusFromDB
} from '../repositories/candidatoRepository.js';

// Obtener candidatos por empresa
export const getCandidatesByCompanyService = async (empresaId) => {
    return await findAllCandidatosByEmpresa(empresaId);
};

// Actualizar estado de un candidato
export const updateCandidateStatusService = async (candidatoId, estado) => {
    return await updateCandidatoStatus(candidatoId, estado);
};

// Aplicar a una oferta de trabajo
export const applyToJobOfferService = async (usuarioId, ofertaEmpleoId) => {
    const existingApplication = await checkApplication(usuarioId, ofertaEmpleoId);
    if (existingApplication) {
        throw new Error('Ya has aplicado a esta oferta');
    }
    return await applyToJobOffer(usuarioId, ofertaEmpleoId);
};


// Verificar el estado de la aplicación
export const checkApplicationStatusService = async (usuarioId, ofertaEmpleoId) => {
    return await checkApplication(usuarioId, ofertaEmpleoId);
};

export const getApplicationCountsByStatus = async (usuarioId) => {
    try {
        return await getApplicationCountsByStatusFromDB(usuarioId);
    } catch (error) {
        throw new Error('Error al obtener las estadísticas de las solicitudes');
    }
};
