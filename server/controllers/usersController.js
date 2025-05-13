import {prisma} from '../prisma/index.js';
import {saveAvatar} from "./supabaseController.js";



/**
 * 1. What does this function do, where is it called?
 * (→ Describe the function’s purpose and trigger point in the app.)
 * e.g., “This function fetches all posts for a specific user. It is triggered when the client navigates to the user's profile page.”
 *
 * 2. What data and method does it expect, and what does it return?
 * (→ Summarize the key input(s) from the frontend or route params and what data is sent back.)
 * e.g., “It expects a userId in the request parameters. It returns an array of posts with related user and comment data.”
 *
 * 3. List the success and error responses. Example:
 *  * 201: User was successfully banned.
 *  * 400: An error occurred (e.g., invalid user ID or database issue).
 * @returns {Promise<void>}
 */


/**
 * 1. This function is used for retrieving and displaying all the other users on the platform
 *    that the user is not already friends with, triggered in DashboardMain.jsx component
 *
 * 2. It expects the ID of the currently logged-in user
 *
 * 3. 200: List of all the other users
 *    500: Server error, log it
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */



export const retrieveUsers = async (req, res) => {
    try {
        const userId = parseInt(req.params.user_id); // Parse the user id

        // Make sure not to include any users that has blocked this user
        const blockedRelations = await prisma.blocks.findMany({
            where: {
                OR: [
                    { blocked: userId },
                    { blocker: userId }
                ]
            }
        });

        // Find all the users friends
        const friends = await prisma.friends.findMany({
            where: {
                OR: [
                    { user_id: parseInt(req.params.user_id) },
                    { friend_id: parseInt(req.params.user_id) },
                ],
            }
        });

        // All the blocked ID
        const blockedIds = blockedRelations.map(b =>
            b.blocker === userId ? b.blocked : b.blocker
        );

        // All the ID of the friends
        const friendIds = friends.map(f =>
            f.user_id === userId ? f.friend_id : f.user_id
        );

        // Find all users that are not the user, that has blocked the user or are their friends
        const usersNotFriends = await prisma.users.findMany({
            where: {
                id: {
                    notIn: [userId, ...friendIds, ...blockedIds],
                },
            }
        });

        // List of the other users
        res.status(200).json(usersNotFriends);
    } catch (err) {
        console.error('Error retrieving users:', err);
        res.status(500).json(`Error fetching other users`);
    }
};



/**
 * 1. What does this function do, where is it called?
 * (→ Describe the function’s purpose and trigger point in the app.)
 * e.g., “This function fetches all posts for a specific user. It is triggered when the client navigates to the user's profile page.”
 *
 * 2. What data and method does it expect, and what does it return?
 * (→ Summarize the key input(s) from the frontend or route params and what data is sent back.)
 * e.g., “It expects a userId in the request parameters. It returns an array of posts with related user and comment data.”
 *
 * 3. List the success and error responses. Example:
 *  * 201: User was successfully banned.
 *  * 400: An error occurred (e.g., invalid user ID or database issue).
 * @returns {Promise<void>}
 */


/**
 * 1. This functions is used to set the information of a
 *
 *
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */



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