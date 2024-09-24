// routes/userRoutes.js
import express from 'express';
import { getUserById } from '../controllers/userController.js';

const router = express.Router();

// Ruta para obtener un usuario por ID
router.get('/:id(\\d+)', getUserById);

export default router;
