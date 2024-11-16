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

export const updateEducacion = (usuarioId, educacionData) => updateDocument(Educacion, usuarioId, educacionData);
export const updateCertificacion = async (usuarioId, certificacionData) => {
    try {
        const results = await Promise.all(
            certificacionData.map(async (item) => {
                if (!item._id) {
                    throw new Error('Se requiere _id para actualizar la certificación');
                }

                // Verificar que el documento existe y pertenece al usuario
                const existingCert = await Certificacion.findOne({
                    _id: item._id,
                    usuarioId: usuarioId
                });

                if (!existingCert) {
                    throw new Error(`No se encontró la certificación con id ${item._id}`);
                }

                // Remover campos que no queremos actualizar
                const { _id, usuarioId: uid, createdAt, updatedAt, __v, ...updateData } = item;

                // Realizar la actualización
                const updated = await Certificacion.findByIdAndUpdate(
                    item._id,
                    {
                        ...updateData,
                        updatedAt: new Date()
                    },
                    {
                        new: true,         // Retorna el documento actualizado
                        runValidators: true // Ejecuta las validaciones del esquema
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
export const updateExperienciaLaboral = (usuarioId, experienciaLaboralData) => updateDocument(ExperienciaLaboral, usuarioId, experienciaLaboralData);
export const updateIdioma = (usuarioId, idiomaData) => updateDocument(Idioma, usuarioId, idiomaData);
export const updateSkill = (usuarioId, skillData) => updateDocument(Skill, usuarioId, skillData);

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
