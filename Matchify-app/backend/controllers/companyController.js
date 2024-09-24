// controllers/companyController.js
import { registerCompanyWithUser } from '../services/companyService.js';

export const registerCompany = async (req, res) => {
    const {
        username, email, password, phone,
        companyName, direccion, descripcion, sitioWeb, industriaId
    } = req.body;

    const userData = { username, email, password, phone };
    const companyData = { nombre: companyName, direccion, telefono: phone, email, descripcion, sitioWeb, industriaId };

    try {
        const { empresa, user } = await registerCompanyWithUser(companyData, userData);
        return res.status(201).json({ success: true, empresa, user });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
