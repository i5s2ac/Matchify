// services/companyService.js
import bcrypt from 'bcryptjs'; // Asegúrate de importar bcryptjs o bcrypt
import { createEmpresa, createEmpresaUsuario, getOrCreateAdminRole } from '../repositories/companyRepository.js';
import { findUserByEmail, createUser } from '../repositories/userRepository.js';

export const registerCompanyWithUser = async (companyData, userData) => {
    // Verifica si el email ya existe
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) throw new Error('Email already in use');

    // Hashear la contraseña
    const hashedPassword = bcrypt.hashSync(userData.password, 10);

    // Crear usuario con la contraseña hasheada
    const user = await createUser({ ...userData, password: hashedPassword });

    // Crear la empresa
    const empresa = await createEmpresa(companyData);

    // Obtener o crear el rol de admin
    const adminRole = await getOrCreateAdminRole();

    // Crear la relación entre empresa y usuario
    await createEmpresaUsuario({ empresaId: empresa.id, usuarioId: user.id, rolId: adminRole.id });

    return { empresa, user };
};
