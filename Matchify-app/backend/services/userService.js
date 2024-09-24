import { findUserById } from '../repositories/userRepository.js';

export const getUserByIdService = async (id) => {
    return await findUserById(id);
};
