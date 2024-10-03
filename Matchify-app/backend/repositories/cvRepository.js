import Educacion from '../models/Educacion.js';
import Certificacion from '../models/Certificacion.js';
import ExperienciaLaboral from '../models/ExperienciaLaboral.js';
import Idioma from '../models/Idioma.js';
import Skill from '../models/Skill.js';

// Crear registros de educación
export const createEducacion = async (usuarioId, educacionData) => {
    const result = await Promise.all(
        educacionData.map(async (educacion) => {
            return await Educacion.create({
                ...educacion,
                usuarioId
            });
        })
    );
    return result;
};

// Crear registros de certificaciones
export const createCertificacion = async (usuarioId, certificacionData) => {
    const result = await Promise.all(
        certificacionData.map(async (certificacion) => {
            return await Certificacion.create({
                ...certificacion,
                usuarioId
            });
        })
    );
    return result;
};

// Crear registros de experiencia laboral
export const createExperienciaLaboral = async (usuarioId, experienciaLaboralData) => {
    const result = await Promise.all(
        experienciaLaboralData.map(async (experiencia) => {
            return await ExperienciaLaboral.create({
                ...experiencia,
                usuarioId
            });
        })
    );
    return result;
};

// Crear registros de idiomas
export const createIdioma = async (usuarioId, idiomaData) => {
    const result = await Promise.all(
        idiomaData.map(async (idioma) => {
            return await Idioma.create({
                ...idioma,
                usuarioId
            });
        })
    );
    return result;
};

// Crear registros de habilidades (skills)
export const createSkill = async (usuarioId, skillData) => {
    const result = await Promise.all(
        skillData.map(async (skill) => {
            return await Skill.create({
                ...skill,
                usuarioId
            });
        })
    );
    return result;
};

// Actualizar registros de educación
export const updateEducacion = async (usuarioId, educacionData) => {
    const result = await Promise.all(
        educacionData.map(async (educacion) => {
            const { id, ...updatedData } = educacion;
            return await Educacion.update(updatedData, {
                where: {
                    id,
                    usuarioId
                }
            });
        })
    );
    return result;
};

// Actualizar registros de certificaciones
export const updateCertificacion = async (usuarioId, certificacionData) => {
    const result = await Promise.all(
        certificacionData.map(async (certificacion) => {
            const { id, ...updatedData } = certificacion;
            return await Certificacion.update(updatedData, {
                where: {
                    id,
                    usuarioId
                }
            });
        })
    );
    return result;
};

// Actualizar registros de experiencia laboral
export const updateExperienciaLaboral = async (usuarioId, experienciaLaboralData) => {
    const result = await Promise.all(
        experienciaLaboralData.map(async (experiencia) => {
            const { id, ...updatedData } = experiencia;
            return await ExperienciaLaboral.update(updatedData, {
                where: {
                    id,
                    usuarioId
                }
            });
        })
    );
    return result;
};

// Actualizar registros de idiomas
export const updateIdioma = async (usuarioId, idiomaData) => {
    const result = await Promise.all(
        idiomaData.map(async (idioma) => {
            const { id, ...updatedData } = idioma;
            return await Idioma.update(updatedData, {
                where: {
                    id,
                    usuarioId
                }
            });
        })
    );
    return result;
};

// Actualizar registros de habilidades (skills)
export const updateSkill = async (usuarioId, skillData) => {
    const result = await Promise.all(
        skillData.map(async (skill) => {
            const { id, ...updatedData } = skill;
            return await Skill.update(updatedData, {
                where: {
                    id,
                    usuarioId
                }
            });
        })
    );
    return result;
};

// Eliminar un registro de educación
export const deleteEducacion = async (usuarioId, id) => {
    return await Educacion.destroy({
        where: {
            id,
            usuarioId
        }
    });
};

// Eliminar un registro de certificación
export const deleteCertificacion = async (usuarioId, id) => {
    return await Certificacion.destroy({
        where: {
            id,
            usuarioId
        }
    });
};

// Eliminar un registro de experiencia laboral
export const deleteExperienciaLaboral = async (usuarioId, id) => {
    return await ExperienciaLaboral.destroy({
        where: {
            id,
            usuarioId
        }
    });
};

// Eliminar un registro de idioma
export const deleteIdioma = async (usuarioId, id) => {
    return await Idioma.destroy({
        where: {
            id,
            usuarioId
        }
    });
};

// Eliminar un registro de habilidad (skill)
export const deleteSkill = async (userId, id) => {
    return await Skill.destroy({
        where: {
            id,
            userId
        }
    });
};

// Obtener registros de educación
export const getEducacion = async (usuarioId) => {
    return await Educacion.findAll({
        where: { usuarioId }
    });
};

// Obtener registros de certificaciones
export const getCertificacion = async (usuarioId) => {
    return await Certificacion.findAll({
        where: { usuarioId }
    });
};

// Obtener registros de experiencia laboral
export const getExperienciaLaboral = async (usuarioId) => {
    return await ExperienciaLaboral.findAll({
        where: { usuarioId }
    });
};

// Obtener registros de idiomas
export const getIdioma = async (usuarioId) => {
    return await Idioma.findAll({
        where: { usuarioId }
    });
};

// Obtener registros de habilidades (skills)
export const getSkill = async (usuarioId) => {
    return await Skill.findAll({
        where: { usuarioId }
    });
};
