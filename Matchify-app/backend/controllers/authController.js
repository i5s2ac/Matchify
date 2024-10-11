// controllers/authController.js
import { loginUser, registerUser } from '../services/authService.js';

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { token, userId, empresaId, rolId } = await loginUser(email, password);
        return res.status(200).json({ success: true, token, userId, empresaId, rolId });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const register = async (req, res) => {
    const { username, email, password, telefono } = req.body;
    try {
        const user = await registerUser({ username, email, password, telefono });
        return res.status(201).json({ success: true, user });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};



