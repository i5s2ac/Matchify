// backend/controllers/companyController.js
import { getClient } from '../config/redisClient.js'; // Importar el cliente de Redis
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

// Método para obtener la información de una empresa por su ID con caché
export const getCompanyById = async (req, res) => {
    const { empresaId } = req.params;
    const redisClient = getClient();
    const cacheKey = `company_${empresaId}`;

    try {
        // Intentar obtener los datos del caché
        const cachedCompany = await redisClient.get(cacheKey);
        if (cachedCompany) {
            console.log(`Cache hit for key: ${cacheKey}`);
            return res.status(200).json({ success: true, empresa: JSON.parse(cachedCompany), cached: true });
        }

        // Si no hay datos en caché, obtener de la base de datos
        const empresa = await getCompanyByIdService(empresaId);
        if (!empresa) {
            return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
        }

        // Guardar los datos en caché por 1 hora (3600 segundos)
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(empresa));
        console.log(`Cache set for key: ${cacheKey}`);

        return res.status(200).json({ success: true, empresa, cached: false });
    } catch (error) {
        console.error(`Error al obtener la empresa: ${error.message}`);
        return res.status(500).json({ success: false, message: `Error al obtener la empresa: ${error.message}` });
    }
};

// Método para actualizar una empresa por su ID y limpiar el caché
export const updateCompanyById = async (req, res) => {
    const { empresaId } = req.params;
    const { nombre, direccion, telefono, email, descripcion, sitioWeb, industriaId } = req.body;
    const redisClient = getClient();
    const cacheKey = `company_${empresaId}`;

    const updatedData = { nombre, direccion, telefono, email, descripcion, sitioWeb, industriaId };

    try {
        const updatedCompany = await updateCompanyService(empresaId, updatedData);

        // Eliminar el caché de la empresa actualizada
        await redisClient.del(cacheKey);
        console.log(`Cache invalidated for key: ${cacheKey}`);

        return res.status(200).json({ success: true, empresa: updatedCompany });
    } catch (error) {
        console.error(`Error actualizando la empresa: ${error.message}`);
        return res.status(500).json({ success: false, message: `Error actualizando la empresa: ${error.message}` });
    }
};
