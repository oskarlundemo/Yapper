


import {prisma} from '../prisma/index.js';


export const getUsername = async (req, res) => {
    try {
        const user = await prisma.users.findUnique({
            where: {
                id: parseInt(req.params.user_id),
            }
        });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json(`Error: ${error}`);
    }
}