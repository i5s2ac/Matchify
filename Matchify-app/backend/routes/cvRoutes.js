import express from 'express';
import { createCV, updateCV, deleteCVSection, getCV, getCVCandidato} from '../controllers/cvController.js';

const router = express.Router();

// Ruta para crear un CV (llenar las tablas de CV)
router.post('/:userId', createCV);

// Ruta para actualizar un CV
router.put('/:userId', updateCV);

// Ruta para eliminar una sección del CV (como educación, experiencia, etc.)
router.delete('/:userId/:section/:id', deleteCVSection);

router.get('/:userId', getCV);

// Nueva ruta para obtener el CV de un candidato por su candidatoId
router.get('/candidato/:candidatoId/cv', getCVCandidato);


export default router;
