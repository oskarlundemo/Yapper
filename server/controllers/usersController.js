import {prisma} from '../prisma/index.js';


export const retrieveUsers = async (req, res) => {
    try {
        const search = req.body.userSearchString?.trim();
        const userId = parseInt(req.params.user_id);


        const friends = await prisma.friends.findMany({
            where: {
                OR: [
                    { user_id: parseInt(req.params.user_id) },
                    { friend_id: parseInt(req.params.user_id) },
                ],
            }
        });

        const friendIds = friends.map(f =>
            f.user_id === userId ? f.friend_id : f.user_id
        );

        const usersNotFriends = await prisma.users.findMany({
            where: {
                id: {
                    notIn: [userId, ...friendIds],
                },
            }
        });

        res.status(200).json(usersNotFriends);
    } catch (err) {
        console.error('Error retrieving users:', err);
        res.status(500).json(`Error: ${err.message}`);
    }
};