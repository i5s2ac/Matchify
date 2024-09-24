import { getUserByIdService } from '../services/userService.js';

export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await getUserByIdService(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
