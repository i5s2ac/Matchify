import express from 'express';
import {getUserById, login, register} from '../controllers/authController.js';

const router = express.Router();

router.get('/:id', getUserById);
router.post('/login', login);
router.post('/register', register);

export default router;
