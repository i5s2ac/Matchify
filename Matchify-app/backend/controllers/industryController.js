// controllers/industryController.js
import { getIndustriesService } from '../services/industryService.js';

export const getIndustries = async (req, res) => {
    try {
        const industrias = await getIndustriesService();
        return res.status(200).json({ success: true, industrias });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
