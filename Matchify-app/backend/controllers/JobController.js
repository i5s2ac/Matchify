import {
    createJobOfferService,
    searchJobOffersService,
    updateJobOfferService,
    deleteJobOfferService,
    getJobOffersByCompanyService,
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

    try {
        const ofertas = await getJobOffersByCompanyService(empresaId, userId);
        return res.status(200).json({ success: true, ofertas });
    } catch (error) {
        console.error('Error fetching job offers:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
