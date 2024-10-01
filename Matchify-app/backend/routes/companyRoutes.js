// routes/companyRoutes.js
import express from 'express';
import { registerCompany, getCompanyById } from '../controllers/companyController.js';

const router = express.Router();

// Ruta para registrar una empresa junto con un usuario
router.post('/register_company', registerCompany);
router.get('/:empresaId', getCompanyById);

export default router;
