import User from '../models/User.js';
import EmpresaUsuario from '../models/EmpresaUsuario.js';
import Industria from '../models/Industria.js';
import Empresa from '../models/Empresa.js'; // Asegúrate de ajustar la ruta correctamente
import Rol from '../models/Rol.js'; // Importa el modelo Rol correctamente


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


// Función para crear una nueva empresa
export const createEmpresa = async ({ nombre, direccion, telefono, email, descripcion, sitioWeb, industriaId }) => {
    return await Empresa.create({ nombre, direccion, telefono, email, descripcion, sitioWeb, industriaId });
};

// Función para crear una relación Empresa-Usuario
export const createEmpresaUsuario = async ({ empresaId, usuarioId, rolId }) => {
    return await EmpresaUsuario.create({ empresaId, usuarioId, rolId });
};

// Obtener o crear el rol 'Admin'
export const getOrCreateAdminRole = async () => {
    let adminRole = await Rol.findOne({ where: { nombre: 'Admin' } });
    if (!adminRole) {
        adminRole = await Rol.create({ nombre: 'Admin', descripcion: 'Administrator of the company' });
    }
    return adminRole;
};

export const getAllIndustrias = async () => {
    return await Industria.findAll({
        attributes: ['id', 'nombre', 'descripcion', 'codigo', 'createdAt', 'updatedAt']
    });
};




