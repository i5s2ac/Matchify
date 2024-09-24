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
router.get('/job/search', searchJobOffersController);
router.put('/job/update/:id', updateJobOfferController);
router.delete('/job/delete/:id', deleteJobOfferController);
router.get('/job/company', getJobOffersByCompanyController);

export default router;
