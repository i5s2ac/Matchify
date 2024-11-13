// services/userService.js
import { findUserById, updateUser } from '../repositories/userRepository.js';

export const getUserByIdService = async (id) => {
    return await findUserById(id);
};

export const updateUserService = async (userId, updates) => {
    try {
        const allowedUpdates = ['username', 'email', 'telefono'];
        const isValidUpdate = Object.keys(updates).every((key) => allowedUpdates.includes(key));

        if (!isValidUpdate) {
            throw new Error('Invalid updates!');
        }

        const updatedUser = await updateUser(userId, updates);

        if (!updatedUser) {
            throw new Error('Usuario no encontrado');
        }

        return updatedUser;
    } catch (error) {
        throw new Error(`Error al actualizar el usuario: ${error.message}`);
    }
};