import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserById, findUserByEmail, createUser, findEmpresaUsuarioByUserId } from '../repositories/userRepository.js'; // Importar el repositorio

// Método para login
// Controlador de login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'Incorrect password' });
        }

        const empresaUsuario = await findEmpresaUsuarioByUserId(user.id);

        const tokenPayload = {
            id: user.id,
            email: user.email,
            empresaId: empresaUsuario ? empresaUsuario.empresaId : null,
            rolId: empresaUsuario ? empresaUsuario.rolId : null,
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            success: true,
            token,
            userId: user.id,
            empresaId: empresaUsuario ? empresaUsuario.empresaId : null,
            rolId: empresaUsuario ? empresaUsuario.rolId : null,
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Método para registrar un nuevo usuario
export const register = async (req, res) => {
    const { username, email, password, phone } = req.body;

    console.log('Registro recibido:', { username, email, password, phone }); // Agrega esto

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await createUser({ username, email, password: hashedPassword, phone });

        return res.status(201).json({
            success: true,
            user: newUser
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await findUserById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

