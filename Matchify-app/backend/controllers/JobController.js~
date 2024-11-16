// backend/controllers/jobController.js
import { getClient } from '../config/redisClient.js'; // Importar el cliente de Redis
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

// Crear una nueva oferta de empleo (POST) - No requiere caché
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

// Buscar ofertas de empleo con filtros (GET) - Implementar caché
export const searchJobOffersController = async (req, res) => {
    const filters = req.query;
    const userId = req.query.userId;
    const redisClient = getClient();
    const cacheKey = `search_job_offers_${JSON.stringify(filters)}_user_${userId}`;

    try {
        // Intentar obtener los datos del caché
        const cachedOffers = await redisClient.get(cacheKey);
        if (cachedOffers) {
            console.log(`Cache hit for key: ${cacheKey}`);
            return res.status(200).json({ success: true, ofertas: JSON.parse(cachedOffers), cached: true });
        }

        // Si no hay datos en caché, obtener de la base de datos
        const ofertas = await searchJobOffersService(filters, userId);

        // Guardar los datos en caché por 5 minutos (300 segundos)
        await redisClient.setEx(cacheKey, 300, JSON.stringify(ofertas));
        console.log(`Cache set for key: ${cacheKey}`);

        return res.status(200).json({ success: true, ofertas, cached: false });
    } catch (error) {
        console.error('Error searching job offers:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Función para actualizar una oferta de empleo y limpiar el caché
export const updateJobOfferController = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    const redisClient = getClient();
    const cacheKey = `job_offer_${id}`;

    try {
        const updatedJobOffer = await updateJobOfferService(id, updatedData);
        if (!updatedJobOffer) {
            return res.status(404).json({ success: false, message: 'Oferta de empleo no encontrada.' });
        }

        // Eliminar el caché de la oferta actualizada
        await redisClient.del(cacheKey);
        console.log(`Cache invalidated for key: ${cacheKey}`);

        return res.status(200).json({ success: true, oferta: updatedJobOffer });
    } catch (error) {
        console.error('Error updating job offer:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Función para eliminar una oferta de empleo y limpiar el caché
export const deleteJobOfferController = async (req, res) => {
    const { id } = req.params;
    const redisClient = getClient();
    const cacheKey = `job_offer_${id}`;

    try {
        await deleteJobOfferService(id);
        // Eliminar el caché de la oferta eliminada
        await redisClient.del(cacheKey);
        console.log(`Cache invalidated for key: ${cacheKey}`);

        return res.status(200).json({ success: true, message: 'Job offer deleted' });
    } catch (error) {
        console.error('Error deleting job offer:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Obtener ofertas de empleo por empresa (GET) - Implementar caché
export const getJobOffersByCompanyController = async (req, res) => {
    const { empresaId, userId } = req.query;
    const redisClient = getClient();
    const cacheKey = `job_offers_company_${empresaId}_user_${userId}`;

    if (!empresaId) {
        return res.status(400).json({ success: false, message: 'El campo empresaId es obligatorio.' });
    }

    try {
        // Intentar obtener los datos del caché
        const cachedOffers = await redisClient.get(cacheKey);
        if (cachedOffers) {
            console.log(`Cache hit for key: ${cacheKey}`);
            return res.status(200).json({ success: true, ofertas: JSON.parse(cachedOffers), cached: true });
        }

        // Si no hay datos en caché, obtener de la base de datos
        const ofertas = await getJobOffersByCompanyService(empresaId, userId);
        if (!ofertas || ofertas.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron ofertas de empleo para esta empresa.' });
        }

        // Guardar los datos en caché por 5 minutos (300 segundos)
        await redisClient.setEx(cacheKey, 300, JSON.stringify(ofertas));
        console.log(`Cache set for key: ${cacheKey}`);

        return res.status(200).json({ success: true, ofertas, cached: false });
    } catch (error) {
        console.error('Error al obtener ofertas de empleo:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Obtener oferta de empleo por ID (GET) - Implementar caché
export const getJobOfferByIdController = async (req, res) => {
    const { id } = req.params;
    const redisClient = getClient();
    const cacheKey = `job_offer_${id}`;

    try {
        // Intentar obtener los datos del caché
        const cachedJobOffer = await redisClient.get(cacheKey);
        if (cachedJobOffer) {
            console.log(`Cache hit for key: ${cacheKey}`);
            return res.status(200).json({ success: true, oferta: JSON.parse(cachedJobOffer), cached: true });
        }

        // Si no hay datos en caché, obtener de la base de datos
        const oferta = await getJobOfferByIdService(id);
        if (!oferta) {
            return res.status(404).json({ success: false, message: 'Oferta no encontrada.' });
        }

        // Guardar los datos en caché por 10 minutos (600 segundos)
        await redisClient.setEx(cacheKey, 600, JSON.stringify(oferta));
        console.log(`Cache set for key: ${cacheKey}`);

        return res.status(200).json({ success: true, oferta, cached: false });
    } catch (error) {
        console.error('Error al obtener la oferta de empleo:', error.message);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Obtener ofertas de empleo activas (GET) - Implementar caché
export const getActiveJobOffersController = async (req, res) => {
    const redisClient = getClient();
    const cacheKey = `active_job_offers`;

    try {
        // Intentar obtener los datos del caché
        const cachedActiveOffers = await redisClient.get(cacheKey);
        if (cachedActiveOffers) {
            console.log(`Cache hit for key: ${cacheKey}`);
            return res.status(200).json({ success: true, ofertas: JSON.parse(cachedActiveOffers), cached: true });
        }

        // Si no hay datos en caché, obtener de la base de datos
        const ofertas = await getActiveJobOffersService();
        if (!ofertas || ofertas.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron ofertas activas.' });
        }

        // Guardar los datos en caché por 10 minutos (600 segundos)
        await redisClient.setEx(cacheKey, 600, JSON.stringify(ofertas));
        console.log(`Cache set for key: ${cacheKey}`);

        return res.status(200).json({ success: true, ofertas, cached: false });
    } catch (error) {
        console.error('Error al obtener ofertas activas:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Función para togglear el estatus de una oferta de empleo y limpiar el caché
export const toggleJobOfferStatusController = async (req, res) => {
    const { id } = req.params;
    const { estatus } = req.body;
    const redisClient = getClient();
    const cacheKey = `job_offer_${id}`;

    // Validar que el estatus sea uno de los valores permitidos
    const validStatuses = ['Activo', 'Inactivo'];
    if (!validStatuses.includes(estatus)) {
        return res.status(400).json({ success: false, message: 'El valor de estatus no es válido.' });
    }

    try {
        const updatedJobOffer = await updateJobOfferService(id, { estatus });
        if (!updatedJobOffer) {
            return res.status(404).json({ success: false, message: 'Oferta no encontrada.' });
        }

        // Eliminar el caché de la oferta actualizada
        await redisClient.del(cacheKey);
        console.log(`Cache invalidated for key: ${cacheKey}`);

        return res.status(200).json({ success: true, oferta: updatedJobOffer });
    } catch (error) {
        console.error('Error al cambiar el estado de la oferta de empleo:', error);
        return res.status(500).json({ success: false, message: `Error interno del servidor: ${error.message}` });
    }
};

// Obtener resumen de trabajos (GET) - Implementar caché
export const getJobSummaryController = async (req, res) => {
    const { empresaId } = req.query;
    const redisClient = getClient();
    const cacheKey = `job_summary_${empresaId}`;

    if (!empresaId) {
        return res.status(400).json({ success: false, message: 'El campo empresaId es obligatorio.' });
    }

    try {
        // Intentar obtener los datos del caché
        const cachedSummary = await redisClient.get(cacheKey);
        if (cachedSummary) {
            console.log(`Cache hit for key: ${cacheKey}`);
            return res.status(200).json({ success: true, summary: JSON.parse(cachedSummary), cached: true });
        }

        // Si no hay datos en caché, obtener de la base de datos
        const summary = await getJobSummaryService(empresaId);
        if (!summary) {
            return res.status(404).json({ success: false, message: 'No se pudo obtener el resumen de trabajos.' });
        }

        // Guardar los datos en caché por 10 minutos (600 segundos)
        await redisClient.setEx(cacheKey, 600, JSON.stringify(summary));
        console.log(`Cache set for key: ${cacheKey}`);

        return res.status(200).json({ success: true, summary, cached: false });
    } catch (error) {
        console.error('Error al obtener el resumen de trabajos:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Obtener conteo de candidatos por oferta de empleo (GET) - Implementar caché
export const getCandidateCountController = async (req, res) => {
    const { id } = req.params;  // Obtener el id de la oferta de empleo de los parámetros de la ruta
    const redisClient = getClient();
    const cacheKey = `candidate_count_job_${id}`;

    try {
        // Intentar obtener los datos del caché
        const cachedCount = await redisClient.get(cacheKey);
        if (cachedCount) {
            console.log(`Cache hit for key: ${cacheKey}`);
            return res.status(200).json({ success: true, candidateCount: JSON.parse(cachedCount), cached: true });
        }

        // Si no hay datos en caché, obtener de la base de datos
        const count = await getCandidateCountService(id);

        // Guardar los datos en caché por 10 minutos (600 segundos)
        await redisClient.setEx(cacheKey, 600, JSON.stringify(count));
        console.log(`Cache set for key: ${cacheKey}`);

        return res.status(200).json({ success: true, candidateCount: count, cached: false });
    } catch (error) {
        console.error('Error al obtener el conteo de candidatos:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};