import { getUserByIdService, updateUserService} from '../services/userService.js';

export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await getUserByIdService(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Controlador para actualizar un usuario por su ID
export const updateUserById = async (req, res) => {
    const userId = req.params.id; // Obtiene el ID del usuario desde los parámetros de la URL
    const { username, email, telefono } = req.body; // Datos enviados en la solicitud

    try {
        const updatedUser = await updateUserService(userId, { username, email, telefono });

        return res.status(200).json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            user: updatedUser
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