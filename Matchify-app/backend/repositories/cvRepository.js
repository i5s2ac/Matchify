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
        experienciaLaboralData.map(async (experienciaLaboral) => {
            return await ExperienciaLaboral.create({
                ...experienciaLaboral,
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

// Actualizar registros
const updateDocument = async (Model, usuarioId, data) => {
    return await Promise.all(
        data.map(async (item) => {
            const { id, ...updatedData } = item;
            return await Model.findOneAndUpdate(
                { _id: id, usuarioId },
                updatedData,
                { new: true }
            );
        })
    );
};

export const updateEducacion = async (usuarioId, educacionData) => {
    try {
        const results = await Promise.all(
            educacionData.map(async (item) => {
                if (!item._id) {
                    throw new Error('Se requiere _id para actualizar la educación');
                }

                const existingEducacion = await Educacion.findOne({
                    _id: item._id,
                    usuarioId: usuarioId
                });

                if (!existingEducacion) {
                    throw new Error(`No se encontró la educación con id ${item._id}`);
                }

                const { _id, usuarioId: uid, createdAt, updatedAt, __v, ...updateData } = item;

                const updated = await Educacion.findByIdAndUpdate(
                    item._id,
                    {
                        ...updateData,
                        updatedAt: new Date()
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                );

                return updated;
            })
        );

        return results;
    } catch (error) {
        console.error('Error en updateEducacion:', error);
        throw error;
    }
};

export const updateCertificacion = async (usuarioId, certificacionData) => {
    try {
        const results = await Promise.all(
            certificacionData.map(async (item) => {
                if (!item._id) {
                    throw new Error('Se requiere _id para actualizar la certificación');
                }

                const existingCert = await Certificacion.findOne({
                    _id: item._id,
                    usuarioId: usuarioId
                });

                if (!existingCert) {
                    throw new Error(`No se encontró la certificación con id ${item._id}`);
                }

                const { _id, usuarioId: uid, createdAt, updatedAt, __v, ...updateData } = item;

                const updated = await Certificacion.findByIdAndUpdate(
                    item._id,
                    {
                        ...updateData,
                        updatedAt: new Date()
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                );

                return updated;
            })
        );

        return results;
    } catch (error) {
        console.error('Error en updateCertificacion:', error);
        throw error;
    }
};

export const updateExperienciaLaboral = async (usuarioId, experienciaLaboralData) => {
    try {
        const results = await Promise.all(
            experienciaLaboralData.map(async (item) => {
                if (!item._id) {
                    throw new Error('Se requiere _id para actualizar la experiencia laboral');
                }

                const existingExp = await ExperienciaLaboral.findOne({
                    _id: item._id,
                    usuarioId: usuarioId
                });

                if (!existingExp) {
                    throw new Error(`No se encontró la experiencia laboral con id ${item._id}`);
                }

                const { _id, usuarioId: uid, createdAt, updatedAt, __v, ...updateData } = item;

                const updated = await ExperienciaLaboral.findByIdAndUpdate(
                    item._id,
                    {
                        ...updateData,
                        updatedAt: new Date()
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                );

                return updated;
            })
        );

        return results;
    } catch (error) {
        console.error('Error en updateExperienciaLaboral:', error);
        throw error;
    }
};

export const updateIdioma = async (usuarioId, idiomaData) => {
    try {
        const results = await Promise.all(
            idiomaData.map(async (item) => {
                if (!item._id) {
                    throw new Error('Se requiere _id para actualizar el idioma');
                }

                const existingIdioma = await Idioma.findOne({
                    _id: item._id,
                    usuarioId: usuarioId
                });

                if (!existingIdioma) {
                    throw new Error(`No se encontró el idioma con id ${item._id}`);
                }

                const { _id, usuarioId: uid, createdAt, updatedAt, __v, ...updateData } = item;

                const updated = await Idioma.findByIdAndUpdate(
                    item._id,
                    {
                        ...updateData,
                        updatedAt: new Date()
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                );

                return updated;
            })
        );

        return results;
    } catch (error) {
        console.error('Error en updateIdioma:', error);
        throw error;
    }
};

export const updateSkill = async (usuarioId, skillData) => {
    try {
        const results = await Promise.all(
            skillData.map(async (item) => {
                if (!item._id) {
                    throw new Error('Se requiere _id para actualizar la habilidad');
                }

                const existingSkill = await Skill.findOne({
                    _id: item._id,
                    usuarioId: usuarioId
                });

                if (!existingSkill) {
                    throw new Error(`No se encontró la habilidad con id ${item._id}`);
                }

                const { _id, usuarioId: uid, createdAt, updatedAt, __v, ...updateData } = item;

                const updated = await Skill.findByIdAndUpdate(
                    item._id,
                    {
                        ...updateData,
                        updatedAt: new Date()
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                );

                return updated;
            })
        );

        return results;
    } catch (error) {
        console.error('Error en updateSkill:', error);
        throw error;
    }
};

// Eliminar un registro
const deleteDocument = async (Model, usuarioId, id) => {
    return await Model.findOneAndDelete({ _id: id, usuarioId });
};

export const deleteEducacion = (usuarioId, id) => deleteDocument(Educacion, usuarioId, id);
export const deleteCertificacion = (usuarioId, id) => deleteDocument(Certificacion, usuarioId, id);
export const deleteExperienciaLaboral = (usuarioId, id) => deleteDocument(ExperienciaLaboral, usuarioId, id);
export const deleteIdioma = (usuarioId, id) => deleteDocument(Idioma, usuarioId, id);
export const deleteSkill = (usuarioId, id) => deleteDocument(Skill, usuarioId, id);

// Obtener registros
const getDocuments = async (Model, usuarioId) => {
    return await Model.find({ usuarioId });
};

export const getEducacion = (usuarioId) => getDocuments(Educacion, usuarioId);
export const getCertificacion = (usuarioId) => getDocuments(Certificacion, usuarioId);
export const getExperienciaLaboral = (usuarioId) => getDocuments(ExperienciaLaboral, usuarioId);
export const getIdioma = (usuarioId) => getDocuments(Idioma, usuarioId);
export const getSkill = (usuarioId) => getDocuments(Skill, usuarioId);

// Obtener el CV completo basado en el candidatoId (que es el mismo que el userId)
export const getCVCandidato = async (candidatoId) => {
    const educacion = await getEducacion(candidatoId);
    const certificaciones = await getCertificacion(candidatoId);
    const experienciaLaboral = await getExperienciaLaboral(candidatoId);
    const idiomas = await getIdioma(candidatoId);
    const skills = await getSkill(candidatoId);

    return {
        educacion,
        certificaciones,
        experienciaLaboral,
        idiomas,
        skills
    };
};
