import {prisma} from '../prisma/index.js';
import {saveAvatar} from "./supabaseController.js";


export const retrieveUsers = async (req, res) => {
    try {
        const userId = parseInt(req.params.user_id);

        const blockedRelations = await prisma.blocks.findMany({
            where: {
                OR: [
                    { blocked: userId },
                    { blocker: userId }
                ]
            }
        });

        const friends = await prisma.friends.findMany({
            where: {
                OR: [
                    { user_id: parseInt(req.params.user_id) },
                    { friend_id: parseInt(req.params.user_id) },
                ],
            }
        });

        const blockedIds = blockedRelations.map(b =>
            b.blocker === userId ? b.blocked : b.blocker
        );

        const friendIds = friends.map(f =>
            f.user_id === userId ? f.friend_id : f.user_id
        );

        const usersNotFriends = await prisma.users.findMany({
            where: {
                id: {
                    notIn: [userId, ...friendIds, ...blockedIds],
                },
            }
        });

        res.status(200).json(usersNotFriends);
    } catch (err) {
        console.error('Error retrieving users:', err);
        res.status(500).json(`Error: ${err.message}`);
    }
};


export const getUserProfileInfo = async (req, res) => {

    try {
        const userInfo = await prisma.users.findUnique({
            where: {
                id: parseInt(req.params.user_id),
            }
        })
        res.status(200).json(userInfo);
    } catch (err) {
        console.error('Error retrieving user profile');
        res.status(500).json(`Error: ${err.message}`);
    }

}


export const sendProfileUpdateResponse = async (req, res) => {
    res.status(200).json({
        bio: req.body.bio,
        avatarUrl: req.body.avatarUrl,
    })
}

export const updateUserAvatar = async (req, res, next) => {
    try {
        if (req.file) {
            await saveAvatar(req, res);
            const user_id = parseInt(req.params.user_id);
            const newAvatar = await prisma.users.update({
                data: {
                    avatar: req.file.originalname,
                },
                where: {
                    id: user_id,
                }
            })
            req.avatarUrl = newAvatar.avatar;
            next();
        }
        next();
    } catch (err) {
        console.error('Error retrieving avatar:', err);
        res.status(500).json(`Error: ${err.message}`);
    }
}


export const updateUserBio = async (req, res, next) => {
    try {
        if (req.body.bio) {
            const updatedUser = await prisma.users.update({
                data: {
                    bio: req.body.bio,
                },
                where: {
                    id: parseInt(req.params.user_id),
                }
            })
            req.bio = updatedUser.bio
            next();
        }
        next();
    } catch (err) {
        console.error('Error retrieving user bio:', err);
        res.status(500).json(`Error: ${err.message}`);
    }
}