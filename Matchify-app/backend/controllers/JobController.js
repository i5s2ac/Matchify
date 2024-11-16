// backend/controllers/jobController.js

import {
    createJobOfferService,
    searchJobOffersService,
    updateJobOfferService,
    deleteJobOfferService,
    getJobOffersByCompanyService,
    getJobOfferByIdService,
    getActiveJobOffersService,
    getJobSummaryService,
    getCandidateCountService
} from '../services/jobService.js';

// Crear una nueva oferta de empleo (POST)
export const createJobOfferController = async (req, res) => {
    const jobData = req.body;

    try {
        const newJobOffer = await createJobOfferService(jobData);
        return res.status(201).json({ success: true, oferta: newJobOffer });
    } catch (error) {
        console.error('Error creating job offer:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Buscar ofertas de empleo con filtros (GET)
export const searchJobOffersController = async (req, res) => {
    const filters = req.query;
    const userId = req.query.userId;

    try {
        const ofertas = await searchJobOffersService(filters, userId);
        return res.status(200).json({ success: true, ofertas });
    } catch (error) {
        console.error('Error searching job offers:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Función para actualizar una oferta de empleo
export const updateJobOfferController = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedJobOffer = await updateJobOfferService(id, updatedData);
        if (!updatedJobOffer) {
            return res.status(404).json({ success: false, message: 'Oferta de empleo no encontrada.' });
        }
        return res.status(200).json({ success: true, oferta: updatedJobOffer });
    } catch (error) {
        console.error('Error updating job offer:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Función para eliminar una oferta de empleo
export const deleteJobOfferController = async (req, res) => {
    const { id } = req.params;

    try {
        await deleteJobOfferService(id);
        return res.status(200).json({ success: true, message: 'Job offer deleted' });
    } catch (error) {
        console.error('Error deleting job offer:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Obtener ofertas de empleo por empresa (GET)
export const getJobOffersByCompanyController = async (req, res) => {
    const { empresaId, userId } = req.query;

    if (!empresaId) {
        return res.status(400).json({ success: false, message: 'El campo empresaId es obligatorio.' });
    }

    try {
        const ofertas = await getJobOffersByCompanyService(empresaId, userId);
        if (!ofertas || ofertas.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron ofertas de empleo para esta empresa.' });
        }
        return res.status(200).json({ success: true, ofertas });
    } catch (error) {
        console.error('Error al obtener ofertas de empleo:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Obtener oferta de empleo por ID (GET)
export const getJobOfferByIdController = async (req, res) => {
    const { id } = req.params;

    try {
        const oferta = await getJobOfferByIdService(id);
        if (!oferta) {
            return res.status(404).json({ success: false, message: 'Oferta no encontrada.' });
        }
        return res.status(200).json({ success: true, oferta });
    } catch (error) {
        console.error('Error al obtener la oferta de empleo:', error.message);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Obtener ofertas de empleo activas (GET)
export const getActiveJobOffersController = async (req, res) => {
    try {
        const ofertas = await getActiveJobOffersService();
        if (!ofertas || ofertas.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron ofertas activas.' });
        }
        return res.status(200).json({ success: true, ofertas });
    } catch (error) {
        console.error('Error al obtener ofertas activas:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Función para togglear el estatus de una oferta de empleo
export const toggleJobOfferStatusController = async (req, res) => {
    const { id } = req.params;
    const { estatus } = req.body;

    const validStatuses = ['Activo', 'Inactivo'];
    if (!validStatuses.includes(estatus)) {
        return res.status(400).json({ success: false, message: 'El valor de estatus no es válido.' });
    }

    try {
        const updatedJobOffer = await updateJobOfferService(id, { estatus });
        if (!updatedJobOffer) {
            return res.status(404).json({ success: false, message: 'Oferta no encontrada.' });
        }
        return res.status(200).json({ success: true, oferta: updatedJobOffer });
    } catch (error) {
        console.error('Error al cambiar el estado de la oferta de empleo:', error);
        return res.status(500).json({ success: false, message: `Error interno del servidor: ${error.message}` });
    }
};

// Obtener resumen de trabajos (GET)
export const getJobSummaryController = async (req, res) => {
    const { empresaId } = req.query;

    if (!empresaId) {
        return res.status(400).json({ success: false, message: 'El campo empresaId es obligatorio.' });
    }

    try {
        const summary = await getJobSummaryService(empresaId);
        if (!summary) {
            return res.status(404).json({ success: false, message: 'No se pudo obtener el resumen de trabajos.' });
        }
        return res.status(200).json({ success: true, summary });
    } catch (error) {
        console.error('Error al obtener el resumen de trabajos:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Obtener conteo de candidatos por oferta de empleo (GET)
export const getCandidateCountController = async (req, res) => {
    const { id } = req.params;

    try {
        const count = await getCandidateCountService(id);
        return res.status(200).json({ success: true, candidateCount: count });
    } catch (error) {
        console.error('Error al obtener el conteo de candidatos:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};
