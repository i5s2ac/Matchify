// repositories/userRepository.js
import User from '../models/User.js';
import mongoose from 'mongoose';

// Buscar un usuario por correo electrónico
export const findUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {
        throw new Error(`Error al buscar el usuario por correo electrónico: ${error.message}`);
    }
};

// Crear un nuevo usuario
export const createUser = async (userData) => {
    try {
        const user = new User(userData);
        return await user.save();
    } catch (error) {
        throw new Error(`Error al crear el usuario: ${error.message}`);
    }
};

// Buscar un usuario por ID
export const findUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return null;
        }
        return user;
    } catch (error) {
        throw new Error(`Error al buscar el usuario por ID: ${error.message}`);
    }
};

// Actualizar un usuario en la base de datos
export const updateUser = async (userId, updates) => {
    try {
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            return null;
        }
        return user;
    } catch (error) {
        throw new Error(`Error al actualizar el usuario en la base de datos: ${error.message}`);
    }
};