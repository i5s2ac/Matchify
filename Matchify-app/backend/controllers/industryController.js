// controllers/industryController.js
import { getIndustriesService } from '../services/industryService.js';

// Ruta para obtener todas las industrias con caché
export const getIndustries = async (req, res) => {
    const redisClient = getClient();
    const cacheKey = `industries`;

    try {
        // Intentar obtener los datos del caché
        const cachedIndustries = await redisClient.get(cacheKey);
        if (cachedIndustries) {
            console.log(`Cache hit for key: ${cacheKey}`);
            return res.status(200).json({ success: true, industrias: JSON.parse(cachedIndustries), cached: true });
        }

        // Si no hay datos en caché, obtener de la base de datos
        const industrias = await getIndustriesService();
        if (!industrias || industrias.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron industrias.' });
        }

        // Guardar los datos en caché por 24 horas (86400 segundos)
        await redisClient.setEx(cacheKey, 86400, JSON.stringify(industrias));
        console.log(`Cache set for key: ${cacheKey}`);

        return res.status(200).json({ success: true, industrias, cached: false });
    } catch (error) {
        console.error('Error al obtener las industrias:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};