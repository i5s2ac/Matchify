import express from 'express';
import {
    createJobOfferController,
    searchJobOffersController,
    updateJobOfferController,
    deleteJobOfferController,
    getJobOffersByCompanyController,
    getJobOfferByIdController,
    getActiveJobOffersController
} from '../controllers/jobController.js';


const router = express.Router();

router.get('/company', getJobOffersByCompanyController);
router.post('/create', createJobOfferController);
router.get('/search', searchJobOffersController);
router.put('/update/:id', updateJobOfferController);
router.delete('/delete/:id', deleteJobOfferController);
router.get('/active', getActiveJobOffersController);
router.get('/:id', getJobOfferByIdController);


export default router;
