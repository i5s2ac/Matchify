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


export const updateCVService = async (userId, cvData) => {
    const { educacion, certificacion, experienciaLaboral, idioma, skill } = cvData;

    // Actualizar registros de educación
    const educacionResult = await updateEducacion(userId, educacion);

    // Actualizar registros de certificacion
    const certificacionResult = await updateCertificacion(userId, certificacion);

    // Actualizar registros de experiencia laboral
    const experienciaLaboralResult = await updateExperienciaLaboral(userId, experienciaLaboral);

    // Actualizar registros de idioma
    const idiomaResult = await updateIdioma(userId, idioma);

    // Actualizar registros de habilidades (skill)
    const skillResult = await updateSkill(userId, skill);

    return {
        educacion: educacionResult,
        certificacion: certificacionResult,
        experienciaLaboral: experienciaLaboralResult,
        idioma: idiomaResult,
        skill: skillResult
    };
};

export const deleteCVSectionService = async (userId, section, id) => {
    switch (section) {
        case 'educacion':
            return await deleteEducacion(userId, id);
        case 'certificacion':
            return await deleteCertificacion(userId, id);
        case 'experienciaLaboral':
            return await deleteExperienciaLaboral(userId, id);
        case 'idioma':
            return await deleteIdioma(userId, id);
        case 'skill':
            return await deleteSkill(userId, id);
        default:
            throw new Error('Sección no válida');
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
