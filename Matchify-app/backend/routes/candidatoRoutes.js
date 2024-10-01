import express from 'express';
import {
    applyToJobOfferController,
    checkApplicationStatusController,
    getCandidatesByCompanyController,
    updateCandidateStatusController
} from '../controllers/candidatoController.js';

const router = express.Router();

router.post('/:userId/apply', applyToJobOfferController);
router.post('/check-application', checkApplicationStatusController);
router.get('/candidates', getCandidatesByCompanyController);
router.put('/update-status', updateCandidateStatusController);

export default router;
