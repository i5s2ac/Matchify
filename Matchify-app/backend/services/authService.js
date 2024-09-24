// services/authService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../repositories/userRepository.js';
import { findEmpresaUsuarioByUserId } from '../repositories/companyRepository.js';

export const loginUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) throw new Error('User not found');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Incorrect password');

    // Obtener empresaId y rolId del usuario
    const empresaUsuario = await findEmpresaUsuarioByUserId(user.id);
    const tokenPayload = {
        id: user.id,
        email: user.email,
        empresaId: empresaUsuario ? empresaUsuario.empresaId : null,
        rolId: empresaUsuario ? empresaUsuario.rolId : null
    };

    // Crear el token JWT
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token, userId: user.id, empresaId: tokenPayload.empresaId, rolId: tokenPayload.rolId };
};

export const registerUser = async (userData) => {
    const { email, password } = userData;

    // Verificar si el correo ya está registrado
    const existingUser = await findUserByEmail(email);
    if (existingUser) throw new Error('Email already registered');

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    userData.password = hashedPassword;

    // Crear el nuevo usuario
    const newUser = await createUser(userData);

    return newUser;
};
