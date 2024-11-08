// backend/controllers/userController.js
import { getClient } from '../config/redisClient.js'; // Importar el cliente de Redis
import { getUserByIdService, updateUserService } from '../services/userService.js';

// Función para obtener datos del usuario con caché
export const getUserById = async (req, res) => {
    const { id } = req.params;
    const redisClient = getClient();
    const cacheKey = `user_${id}`;

    try {
        // Intentar obtener los datos del caché
        const cachedUser = await redisClient.get(cacheKey);
        if (cachedUser) {
            console.log(`Cache hit for key: ${cacheKey}`);
            return res.status(200).json({ success: true, user: JSON.parse(cachedUser), cached: true });
        }

        // Si no hay datos en caché, obtener de la base de datos
        const user = await getUserByIdService(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Guardar los datos en caché por 1 hora (3600 segundos)
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(user));
        console.log(`Cache set for key: ${cacheKey}`);

        return res.status(200).json({ success: true, user, cached: false });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Función para actualizar datos del usuario y limpiar el caché
export const updateUserById = async (req, res) => {
    const userId = req.params.id;
    const { username, email, telefono } = req.body;
    const redisClient = getClient();
    const cacheKey = `user_${userId}`;

    try {
        const updatedUser = await updateUserService(userId, { username, email, telefono });

        // Eliminar el caché del usuario actualizado
        await redisClient.del(cacheKey);
        console.log(`Cache invalidated for key: ${cacheKey}`);

        return res.status(200).json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error actualizando el usuario:', error);

        if (error.message === 'Invalid updates!') {
            return res.status(400).json({ success: false, message: error.message });
        } else if (error.message === 'Usuario no encontrado') {
            return res.status(404).json({ success: false, message: error.message });
        }

        return res.status(500).json({ success: false, message: 'Error Interno del Servidor' });
    }
};