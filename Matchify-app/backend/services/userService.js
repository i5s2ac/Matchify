import { findUserById, updateUser } from '../repositories/userRepository.js';

export const getUserByIdService = async (id) => {
    return await findUserById(id);
};

// Servicio para actualizar un usuario por su ID
export const updateUserService = async (userId, updates) => {
    try {
        // Definir los campos permitidos para la actualización
        const allowedUpdates = ['username', 'email', 'telefono'];
        const isValidUpdate = Object.keys(updates).every((key) => allowedUpdates.includes(key));

        if (!isValidUpdate) {
            throw new Error('Invalid updates!'); // Error si se intenta actualizar un campo no permitido
        }

        const updatedUser = await updateUser(userId, updates);

        if (!updatedUser) {
            throw new Error('Usuario no encontrado'); // Error si el usuario no existe
        }

        return updatedUser; // Retorna el usuario actualizado
    } catch (error) {
        throw new Error(`Error al actualizar el usuario: ${error.message}`);
    }
};
