import { createEducacion, createCertificacion, createExperienciaLaboral, createIdioma, createSkill,
    updateEducacion, updateCertificacion, updateExperienciaLaboral, updateIdioma, updateSkill,
    deleteEducacion, deleteCertificacion, deleteExperienciaLaboral, deleteIdioma, deleteSkill,
    getEducacion, getCertificacion, getExperienciaLaboral, getIdioma, getSkill, getCVCandidato} from '../repositories/cvRepository.js';

export const createCVService = async (userId, cvData) => {
    const { educacion = [], certificacion = [], experienciaLaboral = [], idioma = [], skill = [] } = cvData;

    // Verifica que los datos sean arrays antes de intentar usarlos
    if (!Array.isArray(educacion) || !Array.isArray(certificacion) || !Array.isArray(experienciaLaboral) || !Array.isArray(idioma) || !Array.isArray(skill)) {
        throw new Error('Algunos de los datos proporcionados no son arrays');
    }

    // Crear registros de educación
    const educacionResult = await createEducacion(userId, educacion);

    // Crear registros de certificacion
    const certificacionResult = await createCertificacion(userId, certificacion);

    // Crear registros de experiencia laboral
    const experienciaLaboralResult = await createExperienciaLaboral(userId, experienciaLaboral);

    // Crear registros de idioma
    const idiomaResult = await createIdioma(userId, idioma);

    // Crear registros de habilidades (skill)
    const skillResult = await createSkill(userId, skill);

    return {
        educacion: educacionResult,
        certificacion: certificacionResult,
        experienciaLaboral: experienciaLaboralResult,
        idioma: idiomaResult,
        skill: skillResult
    };
};


// Función auxiliar para validar los datos antes de procesar
const validateCVData = (data) => {
    const sections = ['educacion', 'certificacion', 'experienciaLaboral', 'idioma', 'skill'];
    sections.forEach(section => {
        if (data[section] && !Array.isArray(data[section])) {
            throw new Error(`La sección ${section} debe ser un array`);
        }
    });
};

// Función auxiliar para procesar actualizaciones
const processUpdates = async (userId, data, updateFunction) => {
    if (!Array.isArray(data)) return [];

    const results = [];
    for (const item of data) {
        if (!item._id) {
            // Si no tiene _id, es un nuevo registro
            const newItem = { ...item, usuarioId: userId };
            const created = await createFunction(userId, [newItem]);
            results.push(created[0]);
        } else {
            // Si tiene _id, actualizar el registro existente
            const updated = await updateFunction(userId, [item]);
            results.push(updated[0]);
        }
    }
    return results;
};

export const updateCVService = async (userId, cvData) => {
    try {
        const { certificacion = [], educacion = [], experienciaLaboral = [], idioma = [], skill = [] } = cvData;

        // Procesar certificaciones
        let certificacionResult = [];
        if (certificacion.length > 0) {
            certificacionResult = await updateCertificacion(userId, certificacion);
        }

        // Procesar educación
        let educacionResult = [];
        if (educacion.length > 0) {
            educacionResult = await updateEducacion(userId, educacion);
        }

        // Procesar experiencia laboral
        let experienciaLaboralResult = [];
        if (experienciaLaboral.length > 0) {
            experienciaLaboralResult = await updateExperienciaLaboral(userId, experienciaLaboral);
        }

        // Procesar idiomas
        let idiomaResult = [];
        if (idioma.length > 0) {
            idiomaResult = await updateIdioma(userId, idioma);
        }

        // Procesar habilidades
        let skillResult = [];
        if (skill.length > 0) {
            skillResult = await updateSkill(userId, skill);
        }

        return {
            success: true,
            data: {
                certificacion: certificacionResult,
                educacion: educacionResult,
                experienciaLaboral: experienciaLaboralResult,
                idioma: idiomaResult,
                skill: skillResult
            }
        };
    } catch (error) {
        console.error('Error en updateCVService:', error);
        throw error;
    }
};


export const deleteCVSectionService = async (userId, section, id) => {
    try {
        let result;
        switch (section) {
            case 'educacion':
                result = await deleteEducacion(userId, id);
                break;
            case 'certificacion':
                result = await deleteCertificacion(userId, id);
                break;
            case 'experienciaLaboral':
                result = await deleteExperienciaLaboral(userId, id);
                break;
            case 'idioma':
                result = await deleteIdioma(userId, id);
                break;
            case 'skill':
                result = await deleteSkill(userId, id);
                break;
            default:
                throw new Error('Sección no válida');
        }

        if (!result) {
            throw new Error('No se encontró el elemento a eliminar');
        }

        return result;
    } catch (error) {
        throw new Error(`Error al eliminar la sección: ${error.message}`);
    }
};

export const getCVService = async (userId) => {
    const educacion = await getEducacion(userId);
    const certificacion = await getCertificacion(userId);
    const experienciaLaboral = await getExperienciaLaboral(userId);
    const idioma = await getIdioma(userId);
    const skill = await getSkill(userId);

    return {
        educacion,
        certificacion,
        experienciaLaboral,
        idioma,
        skill
    };
};

// Servicio para obtener el CV de un candidato basado en su candidatoId
export const getCVCandidatoService = async (candidatoId) => {
    return await getCVCandidato(candidatoId);  // Llama al repositorio para obtener los datos del CV
};
