import Industria from '../models/Industria.js';

export const getAllIndustrias = async () => {
    try {
        return await Industria.find().select('id nombre descripcion codigo createdAt updatedAt');
    } catch (error) {
        throw new Error(`Error al obtener todas las industrias: ${error.message}`);
    }
};
