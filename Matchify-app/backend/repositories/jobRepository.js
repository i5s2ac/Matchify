import OfertaEmpleo from '../models/OfertaEmpleo.js';
import Empresa from '../models/Empresa.js';
import User from '../models/User.js';
import CandidatoOferta from '../models/CandidatoOferta.js';  // Asegúrate de importar CandidatoOferta
import { Op } from 'sequelize';

// Crear una nueva oferta de empleo
export const createJobOffer = async (jobData) => {
    try {
        return await OfertaEmpleo.create(jobData);
    } catch (error) {
        throw new Error(`Error al crear la oferta de empleo: ${error.message}`);
    }
};


// Buscar ofertas de empleo con filtros
export const searchJobOffers = async (filters) => {
    return await OfertaEmpleo.findAll({
        where: filters,
        order: [['fechaPublicacion', 'DESC']],
    });
};

// Obtener todas las empresas por sus IDs
export const getEmpresasByIds = async (empresaIds) => {
    return await Empresa.findAll({
        where: { id: empresaIds },
        attributes: ['id', 'nombre', 'telefono', 'sitioWeb', 'email', 'descripcion', 'direccion'],
    });
};

// Obtener usuario por ID
export const getUserById = async (userId) => {
    return await User.findOne({
        where: { id: userId },
        attributes: ['username'],
    });
};

// Obtener una oferta de empleo por ID
export const getJobOfferById = async (id) => {
    return await OfertaEmpleo.findByPk(id);
};

// Actualizar una oferta de empleo
export const updateJobOffer = async (id, updatedData) => {
    const oferta = await OfertaEmpleo.findByPk(id);
    if (!oferta) throw new Error('Oferta no encontrada');
    return await oferta.update(updatedData);
};

// Eliminar una oferta de empleo
export const deleteJobOffer = async (id) => {
    const oferta = await OfertaEmpleo.findByPk(id);
    if (!oferta) throw new Error('Oferta no encontrada');
    await oferta.destroy();  // Destruir la oferta encontrada
};

// Obtener ofertas de empleo por empresa y opcionalmente por usuario
export const getJobOffersByCompany = async (empresaId, userId) => {
    const whereClause = { empresaId };
    if (userId) whereClause.userId = userId;

    return await OfertaEmpleo.findAll({
        where: whereClause,
        order: [['fechaPublicacion', 'DESC']],
    });
};

// Obtener todas las ofertas activas
export const getActiveJobOffers = async () => {
    return await OfertaEmpleo.findAll({
        where: {
            estatus: 'Activo'  // Suponiendo que 'estatus' sea el campo que indica si la oferta está activa
        },
        order: [['fechaPublicacion', 'DESC']],
    });
};

export const getJobCountByStatus = async (empresaId, status) => {
    return await OfertaEmpleo.count({
        where: {
            empresaId,
            estatus: status
        }
    });
};

export const getJobOffersByStatus = async (empresaId, status) => {
    return await OfertaEmpleo.findAll({
        where: {
            empresaId,
            estatus: status
        },
        attributes: ['id', 'titulo', 'fechaPublicacion'],  // Seleccionamos solo los campos necesarios
        order: [['fechaPublicacion', 'DESC']],
    });
};

// Función para contar los candidatos aplicados a una oferta de empleo
export const countCandidatesForJobOffer = async (jobOfferId) => {
    try {
        // Utilizar el modelo `CandidatoOferta` para contar los candidatos que aplicaron a la oferta
        const count = await CandidatoOferta.count({
            where: {
                ofertaEmpleoId: jobOfferId,  // Asegúrate de que el campo `ofertaEmpleoId` es el correcto
            },
        });
        return count;
    } catch (error) {
        throw new Error(`Error al contar los candidatos aplicados a la oferta: ${error.message}`);
    }
};
