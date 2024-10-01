import {
    findAllCandidatosByEmpresa,
    findCandidatoById,
    updateCandidatoStatus,
    applyToJobOffer,
    checkApplication,
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
