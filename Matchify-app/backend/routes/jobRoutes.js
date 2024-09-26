import express from 'express';
import {
    createJobOfferController,
    searchJobOffersController,
    updateJobOfferController,
    deleteJobOfferController,
    getJobOffersByCompanyController,
    getJobOfferByIdController // Agrega esto
} from '../controllers/jobController.js';


const router = express.Router();

router.get('/company', getJobOffersByCompanyController);
router.post('/create', createJobOfferController);
router.get('/search', searchJobOffersController);
router.put('/update/:id', updateJobOfferController);
router.delete('/delete/:id', deleteJobOfferController);
router.get('/:id', getJobOfferByIdController);  // Nueva ruta para obtener una oferta por ID

export default router;
