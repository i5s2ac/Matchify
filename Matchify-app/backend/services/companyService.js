// services/companyService.js
import { createEmpresa, createEmpresaUsuario, getOrCreateAdminRole } from '../repositories/companyRepository.js';
import { findUserByEmail, createUser } from '../repositories/userRepository.js';

export const registerCompanyWithUser = async (companyData, userData) => {
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) throw new Error('Email already in use');

    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    const user = await createUser({ ...userData, password: hashedPassword });

    const empresa = await createEmpresa(companyData);

    const adminRole = await getOrCreateAdminRole();
    await createEmpresaUsuario({ empresaId: empresa.id, usuarioId: user.id, rolId: adminRole.id });

    return { empresa, user };
};
