import express from 'express';
import {
    applyToJobOfferController,
    checkApplicationStatusController,
    getCandidatesByCompanyController,
    updateCandidateStatusController,
    getApplicationCounts
} from '../controllers/candidatoController.js';

const router = express.Router();

router.post('/:userId/apply', applyToJobOfferController);
router.post('/check-application', checkApplicationStatusController);
router.get('/candidates', getCandidatesByCompanyController);
router.put('/update-status', updateCandidateStatusController);
router.get('/:usuarioId/application-counts', getApplicationCounts);

export default router;
