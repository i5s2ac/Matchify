import OfertaEmpleo from '../models/OfertaEmpleo.js';
import Empresa from '../models/Empresa.js';
import User from '../models/User.js';
import CandidatoOferta from '../models/CandidatoOferta.js';

// Crear una nueva oferta de empleo
export const createJobOffer = async (jobData) => {
    try {
        const oferta = new OfertaEmpleo(jobData);
        return await oferta.save();
    } catch (error) {
        throw new Error(`Error al crear la oferta de empleo: ${error.message}`);
    }
};

// Buscar ofertas de empleo con filtros
export const searchJobOffers = async (filters) => {
    try {
        return await OfertaEmpleo.find(filters).sort({ fechaPublicacion: -1 });
    } catch (error) {
        throw new Error(`Error al buscar ofertas de empleo: ${error.message}`);
    }
};

// Obtener todas las empresas por sus IDs
export const getEmpresasByIds = async (empresaIds) => {
    try {
        return await Empresa.find({ _id: { $in: empresaIds } }).select('id nombre telefono sitioWeb email descripcion direccion');
    } catch (error) {
        throw new Error(`Error al obtener empresas por IDs: ${error.message}`);
    }
};

// Obtener usuario por ID
export const getUserById = async (userId) => {
    try {
        return await User.findById(userId).select('username');
    } catch (error) {
        throw new Error(`Error al obtener usuario por ID: ${error.message}`);
    }
};

// Obtener una oferta de empleo por ID
export const getJobOfferById = async (id) => {
    try {
        return await OfertaEmpleo.findById(id);
    } catch (error) {
        throw new Error(`Error al obtener oferta de empleo por ID: ${error.message}`);
    }
};

// Actualizar una oferta de empleo
export const updateJobOffer = async (id, updatedData) => {
    try {
        const oferta = await OfertaEmpleo.findByIdAndUpdate(id, updatedData, { new: true });
        if (!oferta) throw new Error('Oferta no encontrada');
        return oferta;
    } catch (error) {
        throw new Error(`Error al actualizar la oferta de empleo: ${error.message}`);
    }
};

// Eliminar una oferta de empleo
export const deleteJobOffer = async (id) => {
    try {
        const oferta = await OfertaEmpleo.findByIdAndDelete(id);
        if (!oferta) throw new Error('Oferta no encontrada');
        return oferta;
    } catch (error) {
        throw new Error(`Error al eliminar la oferta de empleo: ${error.message}`);
    }
};

// Obtener ofertas de empleo por empresa y opcionalmente por usuario
export const getJobOffersByCompany = async (empresaId, userId) => {
    try {
        const filters = { empresaId };
        if (userId) filters.userId = userId;

        return await OfertaEmpleo.find(filters).sort({ fechaPublicacion: -1 });
    } catch (error) {
        throw new Error(`Error al obtener ofertas de empleo por empresa: ${error.message}`);
    }
};

// Obtener todas las ofertas activas
export const getActiveJobOffers = async () => {
    try {
        return await OfertaEmpleo.find({ estatus: 'Activo' }).sort({ fechaPublicacion: -1 });
    } catch (error) {
        throw new Error(`Error al obtener ofertas de empleo activas: ${error.message}`);
    }
};

// Contar ofertas de empleo por estado y empresa
export const getJobCountByStatus = async (empresaId, status) => {
    try {
        return await OfertaEmpleo.countDocuments({ empresaId, estatus: status });
    } catch (error) {
        throw new Error(`Error al contar ofertas de empleo por estado: ${error.message}`);
    }
};

// Obtener ofertas de empleo por estado
export const getJobOffersByStatus = async (empresaId, status) => {
    try {
        return await OfertaEmpleo.find({ empresaId, estatus: status })
            .select('id titulo fechaPublicacion')
            .sort({ fechaPublicacion: -1 });
    } catch (error) {
        throw new Error(`Error al obtener ofertas de empleo por estado: ${error.message}`);
    }
};

// Contar candidatos aplicados a una oferta de empleo
export const countCandidatesForJobOffer = async (jobOfferId) => {
    try {
        return await CandidatoOferta.countDocuments({ ofertaEmpleoId: jobOfferId });
    } catch (error) {
        throw new Error(`Error al contar los candidatos aplicados a la oferta: ${error.message}`);
    }
};
