import {
    getCandidatesByCompanyService,
    updateCandidateStatusService,
    applyToJobOfferService,
    checkApplicationStatusService,
    getApplicationCountsByStatus
} from '../services/candidatoService.js';

// Controlador para aplicar a una oferta de empleo
export const applyToJobOfferController = async (req, res) => {
    const { ofertaEmpleoId } = req.body;
    const { userId } = req.params;

    console.log("Datos recibidos:", { userId, ofertaEmpleoId });  // Depuración

    try {
        const nuevaCandidatura = await applyToJobOfferService(userId, ofertaEmpleoId);
        return res.status(201).json({ success: true, data: nuevaCandidatura });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Error al aplicar: ${error.message}` });
    }
};


// Controlador para verificar el estado de la aplicación
export const checkApplicationStatusController = async (req, res) => {
    const { usuarioId, ofertaEmpleoId } = req.body;

    try {
        const status = await checkApplicationStatusService(usuarioId, ofertaEmpleoId);
        return res.status(200).json({ success: true, status });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Error al verificar estado: ${error.message}` });
    }
};

// Controlador para obtener candidatos por empresa
export const getCandidatesByCompanyController = async (req, res) => {
    const { empresaId } = req.query;

    try {
        const candidatos = await getCandidatesByCompanyService(empresaId);
        return res.status(200).json({ success: true, candidatos });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Error al obtener candidatos: ${error.message}` });
    }
};

// Controlador para actualizar el estado de un candidato
export const updateCandidateStatusController = async (req, res) => {
    const { candidatoId, estado } = req.body;

    try {
        const candidatoActualizado = await updateCandidateStatusService(candidatoId, estado);
        return res.status(200).json({ success: true, data: candidatoActualizado });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Error al actualizar candidato: ${error.message}` });
    }
};

export const getApplicationCounts = async (req, res) => {
    const { usuarioId } = req.params;

    try {
        const counts = await getApplicationCountsByStatus(usuarioId);
        return res.status(200).json({ success: true, counts });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al obtener las estadísticas' });
    }
};
