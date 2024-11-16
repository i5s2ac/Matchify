// controllers/industryController.js
import { getIndustriesService } from '../services/industryService.js';

// Ruta para obtener todas las industrias sin caché
export const getIndustries = async (req, res) => {
    try {
        // Obtener los datos directamente de la base de datos
        const industrias = await getIndustriesService();
        if (!industrias || industrias.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron industrias.' });
        }

        return res.status(200).json({ success: true, industrias });
    } catch (error) {
        console.error('Error al obtener las industrias:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
