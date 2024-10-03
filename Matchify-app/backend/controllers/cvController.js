import { createCVService, updateCVService,  deleteCVSectionService, getCVService} from '../services/cvService.js';

export const createCV = async (req, res) => {
    const { userId } = req.params;
    const { educacion = [], certificaciones = [], experienciaLaboral = [], idiomas = [], skills = [] } = req.body;

    try {
        const result = await createCVService(userId, { educacion, certificaciones, experienciaLaboral, idiomas, skills });
        return res.status(201).json({ success: true, message: 'CV creado exitosamente', data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al crear el CV', error: error.message });
    }
};


export const updateCV = async (req, res) => {
    const { userId } = req.params;
    const { educacion, certificaciones, experienciaLaboral, idiomas, skills } = req.body;

    try {
        const result = await updateCVService(userId, { educacion, certificaciones, experienciaLaboral, idiomas, skills });
        return res.status(200).json({ success: true, message: 'CV actualizado exitosamente', data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al actualizar el CV', error: error.message });
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