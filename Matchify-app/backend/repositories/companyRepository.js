import Empresa from '../models/Empresa.js';
import EmpresaUsuario from '../models/EmpresaUsuario.js';
import Rol from '../models/Rol.js';
import Industria from '../models/Industria.js';


export const createEmpresa = async (empresaData) => {
    try {
        // Buscar la industria en base al nombre proporcionado en empresaData
        const industria = await Industria.findOne({ nombre: empresaData.industriaId });

        // Si la industria no existe, lanza un error
        if (!industria) {
            throw new Error(`Industria con nombre "${empresaData.industriaId}" no encontrada.`);
        }

        // Asigna el ObjectId de la industria encontrada a industriaId en empresaData
        empresaData.industriaId = industria._id;

        // Crear la empresa con el ObjectId de industriaId correcto
        return await Empresa.create(empresaData);
    } catch (error) {
        throw new Error(`Error al crear la empresa: ${error.message}`);
    }
};

export const createEmpresaUsuario = async ({ empresaId, usuarioId, rolId }) => {
    try {
        return await EmpresaUsuario.create({ empresaId, usuarioId, rolId });
    } catch (error) {
        throw new Error(`Error al crear la relación Empresa-Usuario: ${error.message}`);
    }
};

export const getOrCreateAdminRole = async () => {
    try {
        let adminRole = await Rol.findOne({ nombre: 'Admin' });
        if (!adminRole) {
            adminRole = await Rol.create({ nombre: 'Admin', descripcion: 'Administrator of the company' });
        }
        return adminRole;
    } catch (error) {
        throw new Error(`Error al obtener o crear el rol de administrador: ${error.message}`);
    }
};

export const findEmpresaUsuarioByUserId = async (id) => {
    try {
        return await EmpresaUsuario.findOne({ usuarioId: id });
    } catch (error) {
        throw new Error(`Error al buscar la relación Empresa-Usuario por ID de usuario: ${error.message}`);
    }
};

// Función para buscar una empresa por ID
export const findCompanyById = async (empresaId) => {
    try {
        return await Empresa.findById(empresaId);
    } catch (error) {
        throw new Error(`Error al buscar la empresa por ID: ${error.message}`);
    }
};
