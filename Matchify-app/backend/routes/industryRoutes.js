// routes/industryRoutes.js
import express from 'express';
import { getIndustries } from '../controllers/industryController.js';

const router = express.Router();

// Ruta para obtener todas las industrias
router.get('/', getIndustries);

export default router;
