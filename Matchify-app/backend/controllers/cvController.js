import { createCVService, updateCVService,  deleteCVSectionService, getCVService, getCVCandidatoService} from '../services/cvService.js';

export const createCV = async (req, res) => {
    const { userId } = req.params;
    const { educacion = [], certificacion = [], experienciaLaboral = [], idioma = [], skill = [] } = req.body;

    try {
        const result = await createCVService(userId, { educacion, certificacion, experienciaLaboral, idioma, skill });
        return res.status(201).json({ success: true, message: 'CV creado exitosamente', data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al crear el CV', error: error.message });
    }
};


export const updateCV = async (req, res) => {
    const { userId } = req.params;
    const cvData = req.body;

    try {
        console.log('Datos recibidos:', JSON.stringify(cvData, null, 2));

        const result = await updateCVService(userId, cvData);

        console.log('Resultado de la actualización:', JSON.stringify(result, null, 2));

        res.status(200).json(result);
    } catch (error) {
        console.error('Error en updateCV:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            details: error.stack
        });
    }
};

export const deleteCVSection = async (req, res) => {
    const { userId, section, id } = req.params;

    try {
        const result = await deleteCVSectionService(userId, section, id);
        return res.status(200).json({ success: true, message: 'Sección eliminada exitosamente', data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al eliminar la sección', error: error.message });
    }
};

export const getCV = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await getCVService(userId);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al obtener el CV', error: error.message });
    }
};

export const getCVCandidato = async (req, res) => {
    const { candidatoId } = req.params;
    console.log(`Solicitud para obtener CV del candidato con ID: ${candidatoId}`);

    try {
        const cv = await getCVCandidatoService(candidatoId);
        return res.status(200).json({ success: true, data: cv });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al obtener el CV del candidato', error: error.message });
    }
};
