import express from 'express';
import {
    createJobOfferController,
    searchJobOffersController,
    updateJobOfferController,
    deleteJobOfferController,
    getJobOffersByCompanyController,
} from '../controllers/jobController.js';


const router = express.Router();

router.post('/create', createJobOfferController);
router.get('/search', searchJobOffersController);
router.put('/update/:id', updateJobOfferController);
router.delete('/delete/:id', deleteJobOfferController);
router.get('/company', getJobOffersByCompanyController);

export default router;
