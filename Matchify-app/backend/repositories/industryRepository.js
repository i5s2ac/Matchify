// repositories/industryRepository.js
import Industria from '../models/Industria.js';

export const getAllIndustrias = async () => {
    return await Industria.findAll({
        attributes: ['id', 'nombre', 'descripcion', 'codigo', 'createdAt', 'updatedAt']
    });
};
