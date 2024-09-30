import {
    createJobOfferService,
    searchJobOffersService,
    updateJobOfferService,
    deleteJobOfferService,
    getJobOffersByCompanyService,
    getJobOfferByIdService,
    getActiveJobOffersService
} from '../services/jobService.js';

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

export const updateJobOfferController = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedJobOffer = await updateJobOfferService(id, updatedData);
        return res.status(200).json({ success: true, oferta: updatedJobOffer });
    } catch (error) {
        console.error('Error updating job offer:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

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

export const getJobOffersByCompanyController = async (req, res) => {
    const { empresaId, userId } = req.query;

    console.log(`empresaId: ${empresaId}, userId: ${userId}`);  // Añade este log para ver los valores

    if (!empresaId) {
        return res.status(400).json({ success: false, message: 'El campo empresaId es obligatorio.' });
    }

    try {
        const ofertas = await getJobOffersByCompanyService(empresaId, userId);
        console.log('Ofertas encontradas:', ofertas);  // Añade este log para ver las ofertas

        if (!ofertas || ofertas.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron ofertas de empleo para esta empresa.' });
        }

        return res.status(200).json({ success: true, ofertas });
    } catch (error) {
        console.error('Error al obtener ofertas de empleo:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

export const getJobOfferByIdController = async (req, res) => {
    const { id } = req.params;

    try {
        const oferta = await getJobOfferByIdService(id);  // Llama al servicio en lugar del repositorio

        if (!oferta) {
            return res.status(404).json({ success: false, message: 'Oferta no encontrada.' });
        }

        return res.status(200).json({ success: true, oferta });
    } catch (error) {
        console.error('Error al obtener la oferta de empleo:', error.message);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Nuevo controlador para obtener las ofertas activas
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

export const toggleJobOfferStatusController = async (req, res) => {
    const { id } = req.params;
    const { estatus } = req.body;

    // Validar que el estatus sea uno de los valores permitidos
    const validStatuses = ['Activo', 'Inactivo'];
    if (!validStatuses.includes(estatus)) {
        return res.status(400).json({ success: false, message: 'El valor de estatus no es válido.' });
    }

    try {
        // Intentar actualizar el estatus de la oferta de empleo
        const updatedJobOffer = await updateJobOfferService(id, { estatus });

        if (!updatedJobOffer) {
            return res.status(404).json({ success: false, message: 'Oferta no encontrada.' });
        }

        return res.status(200).json({ success: true, oferta: updatedJobOffer });
    } catch (error) {
        // Manejar los errores internos del servidor
        console.error('Error al cambiar el estado de la oferta de empleo:', error);
        return res.status(500).json({ success: false, message: `Error interno del servidor: ${error.message}` });
    }
};

