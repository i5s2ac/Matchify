// backend/controllers/companyController.js
import { registerCompanyWithUser, getCompanyByIdService } from '../services/companyService.js';

// Método para registrar una empresa y usuario
export const registerCompany = async (req, res) => {
    const {
        username, email, password, telefono,
        companyName, direccion, descripcion, sitioWeb, industriaId
    } = req.body;

    const userData = { username, email, password, telefono };
    const companyData = { nombre: companyName, direccion, telefono, email, descripcion, sitioWeb, industriaId };

    try {
        const { empresa, user } = await registerCompanyWithUser(companyData, userData);
        return res.status(201).json({ success: true, empresa, user });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// Método para obtener la información de una empresa por su ID sin caché
export const getCompanyById = async (req, res) => {
    const { empresaId } = req.params;

    try {
        // Obtener los datos directamente de la base de datos
        const empresa = await getCompanyByIdService(empresaId);
        if (!empresa) {
            return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
        }

        return res.status(200).json({ success: true, empresa });
    } catch (error) {
        console.error(`Error al obtener la empresa: ${error.message}`);
        return res.status(500).json({ success: false, message: `Error al obtener la empresa: ${error.message}` });
    }
};

// Método para actualizar una empresa por su ID
export const updateCompanyById = async (req, res) => {
    const { empresaId } = req.params;
    const { nombre, direccion, telefono, email, descripcion, sitioWeb, industriaId } = req.body;

    const updatedData = { nombre, direccion, telefono, email, descripcion, sitioWeb, industriaId };

    try {
        const updatedCompany = await updateCompanyService(empresaId, updatedData);
        return res.status(200).json({ success: true, empresa: updatedCompany });
    } catch (error) {
        console.error(`Error actualizando la empresa: ${error.message}`);
        return res.status(500).json({ success: false, message: `Error actualizando la empresa: ${error.message}` });
    }
};
