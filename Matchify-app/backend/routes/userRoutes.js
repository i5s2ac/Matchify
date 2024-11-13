// routes/userRoutes.js
import express from 'express';
import { getUserById, updateUserById } from '../controllers/userController.js';

const router = express.Router();

// Ruta para obtener un usuario por ID
router.get('/:userId', getUserById);
router.put('/:userId', updateUserById);

export default router;
