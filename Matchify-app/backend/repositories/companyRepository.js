// repositories/companyRepository.js
import Empresa from '../models/Empresa.js';
import EmpresaUsuario from '../models/EmpresaUsuario.js';
import Rol from '../models/Rol.js';

export const createEmpresa = async (empresaData) => {
    return await Empresa.create(empresaData);
};

export const createEmpresaUsuario = async ({ empresaId, usuarioId, rolId }) => {
    return await EmpresaUsuario.create({ empresaId, usuarioId, rolId });
};

export const getOrCreateAdminRole = async () => {
    let adminRole = await Rol.findOne({ where: { nombre: 'Admin' } });
    if (!adminRole) {
        adminRole = await Rol.create({ nombre: 'Admin', descripcion: 'Administrator of the company' });
    }
    return adminRole;
};

export const findEmpresaUsuarioByUserId = async (id) => {
    return await EmpresaUsuario.findOne({ where: { usuarioId: id } });
};
