import OfertaEmpleo from '../models/OfertaEmpleo.js';
import Empresa from '../models/Empresa.js';
import User from '../models/User.js';
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
    return await oferta.destroy();
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
