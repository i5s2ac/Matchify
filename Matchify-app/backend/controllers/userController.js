// controllers/userController.js
import { getUserByIdService, updateUserService } from '../services/userService.js';
import mongoose from 'mongoose';

export const getUserById = async (req, res) => {
    const { userId } = req.params;

    console.log('userId recibido:', userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            message: 'ID de usuario no válido'
        });
    }

    try {
        const user = await getUserByIdService(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el usuario'
        });
    }
};

export const updateUserById = async (req, res) => {
    const { userId } = req.params;
    const { username, email, telefono } = req.body;

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