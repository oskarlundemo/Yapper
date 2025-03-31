

import {prisma} from '../prisma/index.js';




export const getConversations = async (req, res) => {

    try {
        const users = await prisma.users.findMany({
            where: {
                username: {
                    contains: req.params.searchquery,
                    mode: "insensitive"  // ✅ Case-insensitive
                }
            }
        });
        res.status(200).json(users);

    } catch (error) {
        console.error(error);
        res.status(500).json(`Error: ${error}`);

    }



}