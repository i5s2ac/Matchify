// repositories/userRepository.js
import User from '../models/User.js';

export const findUserByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};

export const createUser = async (userData) => {
    return await User.create(userData);
};

export const findUserById = async (id) => {
    return await User.findByPk(id);
};

// Función para actualizar un usuario en la base de datos
export const updateUser = async (userId, updates) => {
    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return null; // Retorna null si el usuario no se encuentra
        }

        await user.update(updates); // Actualiza el usuario con los datos proporcionados
        return user; // Retorna el usuario actualizado
    } catch (error) {
        throw new Error(`Error al actualizar el usuario en la base de datos: ${error.message}`);
    }
};


