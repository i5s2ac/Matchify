// services/industryService.js
import { getAllIndustrias } from '../repositories/industryRepository.js';

export const getIndustriesService = async () => {
    return await getAllIndustrias();
};
