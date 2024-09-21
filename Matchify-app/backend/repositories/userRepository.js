import User from '../models/User.js';
import EmpresaUsuario from '../models/EmpresaUsuario.js';

// Buscar usuario por email
export const findUserByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};

// Crear un nuevo usuario
export const createUser = async (userData) => {
    return await User.create(userData);
};

// Buscar relación empresa-usuario
export const findEmpresaUsuarioByUserId = async (id) => {
    return await EmpresaUsuario.findOne({ where: { usuarioId: id } });
};

export const findUserById = async (id) => {
    return await User.findByPk(id);
};
