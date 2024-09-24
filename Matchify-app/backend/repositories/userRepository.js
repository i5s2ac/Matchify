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



