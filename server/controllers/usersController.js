import {prisma} from '../prisma/index.js';
import {saveAvatar} from "./supabaseController.js";


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



export const updateUserProfile = async (req, res) => {

    try {
        const userId = parseInt(req.params.user_id);

        const userProfile = await prisma.users.findUnique({
            where: {
                id: userId,
            }
        })

        await updateUserBio(req, res, userProfile)
        await updateAvatar(req, res, userProfile)

    } catch (err) {
        console.error('Error retrieving user profile:', err);
    }
}



export const updateAvatar = async (req, res, userProfile) => {
    try {
        if (req.file) {
            console.log(req.file);
            await prisma.users.update({
                data: {
                    avatar: req.file.originalname,
                },
                where: {
                    id: userProfile.id,
                }
            })
            await saveAvatar(req, res);
        }
    } catch (err) {
        console.error('Error retrieving avatar:', err);
        res.status(500).json(`Error: ${err.message}`);
    }
}






export const updateUserBio = async (req, res) => {
    try {
        if (!req.body.bio)
            return res.status(400).send('Bio not found');

        await prisma.users.update({
            data: {
                bio: req.body.bio,
            },
            where: {
                id: parseInt(req.params.user_id),
            }
        })
    } catch (err) {
        console.error('Error retrieving user bio:', err);
        res.status(500).json(`Error: ${err.message}`);
    }
}