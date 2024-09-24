import express from 'express';
import {getUserById, login, register, registerCompany, getIndustries} from '../controllers/authController.js';

const router = express.Router();

router.get('/industrias',getIndustries );

// Ruta para obtener un usuario por ID
router.get('/:id(\\d+)', getUserById);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para registrar una empresa junto con un usuario
router.post('/register_company', registerCompany);






export default router;
