import express from 'express';
import {
    createJobOfferController,
    searchJobOffersController,
    updateJobOfferController,
    deleteJobOfferController,
    getJobOffersByCompanyController,
    getJobOfferByIdController,
    getActiveJobOffersController,
    toggleJobOfferStatusController,
    getJobSummaryController,
    getCandidateCountController
} from '../controllers/jobController.js';

const router = express.Router();

router.get('/company', getJobOffersByCompanyController);
router.post('/create', createJobOfferController);
router.get('/search', searchJobOffersController);
router.put('/update/:id', updateJobOfferController);
router.put('/toggle-status/:id', toggleJobOfferStatusController);
router.delete('/delete/:id', deleteJobOfferController);
router.get('/active', getActiveJobOffersController);
router.get('/:id', getJobOfferByIdController);
router.get('/summary/:empresaId', getJobSummaryController);
router.get('/:id/candidate-count', getCandidateCountController);

export default router;
