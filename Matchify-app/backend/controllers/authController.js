import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
    findUserById,
    findUserByEmail,
    createUser,
    findEmpresaUsuarioByUserId,
    createEmpresa,
    createEmpresaUsuario,
    getAllIndustrias,
    getOrCreateAdminRole
} from '../repositories/userRepository.js';

// Método para login
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

// Método para obtener un usuario por ID
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

// Función para registrar una empresa junto con un usuario
export const registerCompany = async (req, res) => {
    const {
        username,
        email,
        password,
        phone,
        companyName,
        direccion,
        descripcion,
        sitioWeb,
        industriaId
    } = req.body;

    if (!username || !email || !password || !phone || !companyName || !industriaId) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await createUser({ username, email, password: hashedPassword, telefono: phone });

        const empresa = await createEmpresa({
            nombre: companyName,
            direccion,
            telefono: phone,
            email,
            descripcion,
            sitioWeb,
            industriaId,
        });

        // Obtener o crear el rol 'Admin'
        const adminRole = await getOrCreateAdminRole();

        // Crear la relación Empresa-Usuario con el rol de admin
        await createEmpresaUsuario({ empresaId: empresa.id, usuarioId: user.id, rolId: adminRole.id });

        return res.status(201).json({ success: true, empresa, user });
    } catch (error) {
        console.error('Error registering company and user:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export const getIndustries = async (req, res) => {
    try {
        const industrias = await getAllIndustrias(); // Llama a la función para obtener industrias
        return res.status(200).json(industrias); // Devuelve las industrias
    } catch (error) {
        console.error('Error fetching industries:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};




