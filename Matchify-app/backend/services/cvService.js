import { createEducacion, createCertificacion, createExperienciaLaboral, createIdioma, createSkill,
    updateEducacion, updateCertificacion, updateExperienciaLaboral, updateIdioma, updateSkill,
    deleteEducacion, deleteCertificacion, deleteExperienciaLaboral, deleteIdioma, deleteSkill,
    getEducacion, getCertificacion, getExperienciaLaboral, getIdioma, getSkill} from '../repositories/cvRepository.js';

export const createCVService = async (userId, cvData) => {
    const { educacion = [], certificaciones = [], experienciaLaboral = [], idiomas = [], skills = [] } = cvData;

    // Verifica que los datos sean arrays antes de intentar usarlos
    if (!Array.isArray(educacion) || !Array.isArray(certificaciones) || !Array.isArray(experienciaLaboral) || !Array.isArray(idiomas) || !Array.isArray(skills)) {
        throw new Error('Algunos de los datos proporcionados no son arrays');
    }

    // Crear registros de educación
    const educacionResult = await createEducacion(userId, educacion);

    // Crear registros de certificaciones
    const certificacionesResult = await createCertificacion(userId, certificaciones);

    // Crear registros de experiencia laboral
    const experienciaLaboralResult = await createExperienciaLaboral(userId, experienciaLaboral);

    // Crear registros de idiomas
    const idiomasResult = await createIdioma(userId, idiomas);

    // Crear registros de habilidades (skills)
    const skillsResult = await createSkill(userId, skills);

    return {
        educacion: educacionResult,
        certificaciones: certificacionesResult,
        experienciaLaboral: experienciaLaboralResult,
        idiomas: idiomasResult,
        skills: skillsResult
    };
};


export const updateCVService = async (userId, cvData) => {
    const { educacion, certificaciones, experienciaLaboral, idiomas, skills } = cvData;

    // Actualizar registros de educación
    const educacionResult = await updateEducacion(userId, educacion);

    // Actualizar registros de certificaciones
    const certificacionesResult = await updateCertificacion(userId, certificaciones);

    // Actualizar registros de experiencia laboral
    const experienciaLaboralResult = await updateExperienciaLaboral(userId, experienciaLaboral);

    // Actualizar registros de idiomas
    const idiomasResult = await updateIdioma(userId, idiomas);

    // Actualizar registros de habilidades (skills)
    const skillsResult = await updateSkill(userId, skills);

    return {
        educacion: educacionResult,
        certificaciones: certificacionesResult,
        experienciaLaboral: experienciaLaboralResult,
        idiomas: idiomasResult,
        skills: skillsResult
    };
};

export const deleteCVSectionService = async (userId, section, id) => {
    switch (section) {
        case 'educacion':
            return await deleteEducacion(userId, id);
        case 'certificacion':
            return await deleteCertificacion(userId, id);
        case 'experiencia':
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
    const certificaciones = await getCertificacion(userId);
    const experienciaLaboral = await getExperienciaLaboral(userId);
    const idiomas = await getIdioma(userId);
    const skills = await getSkill(userId);

    return {
        educacion,
        certificaciones,
        experienciaLaboral,
        idiomas,
        skills
    };
};
