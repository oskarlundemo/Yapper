import {prisma} from '../prisma/index.js';
import {deleteOldAvatar, saveNewAvatar} from "./supabaseController.js";



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
 * 1. This functions is used to set the information of a user in the profile sidebar. So when a
 *    when clicks on their profile picture they se their whole profile. It is called in the DashboardContext.jsx
 *    component within the showUserInfo function
 *
 * 2. It expects the ID of the user that is inspected, taken in through the request parameters of the
 *    GET request
 *
 *
 * 3. 200: Success, sends back the info regarding the user
 *    500: Server error, log it
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */

export const getUserProfileInfo = async (req, res) => {

    try {
        // Find the inspected user
        const userInfo = await prisma.users.findUnique({
            where: {
                id: parseInt(req.params.user_id),
            }
        })
        res.status(200).json(userInfo); // Successful, send this back
    } catch (err) {
        console.error(err); // Error, display it
        res.status(500).json(`Error fetching user profile`);
    }

}


/**
 * 1. This function is used for updating the users avatar / profile picture once they submit the changes
 *    inside the UserProfile.jsx component
 *
 * 2. It requires the ID of the user updating their profile which is sent in the request parameters of
 *    the POST request. It also takes in the file from the request object which is passed through using multer.
 *    If successful, it moves on to the next middleware
 *
 * 3. 500: Server error, log it and display
 *
 *
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */


export const updateUserAvatar = async (req, res, next) => {
    try {

        if (req.file) { // If there is no file uploaded, skip this

            const user_id = parseInt(req.params.user_id); // Parse the ID

            const oldAvatar = await prisma.users.findUnique({
                where: {
                    id: user_id
                }
            })

            await deleteOldAvatar(req, res, oldAvatar.avatar);

            const uniqueFileName = await saveNewAvatar(req, res); // Else save the avatar to Supabase (call to supabaseController.js)

            const newAvatar = await prisma.users.update({
                data: {
                    avatar: uniqueFileName, // Update the reference to the new path
                },
                where: {
                    id: user_id,
                }
            })

            req.avatarUrl = newAvatar.avatar; // Amend the path to the request parameters

            next();
        }
        next(); // Next middleware

    } catch (err) {
        console.error('Error updating avatar:', err);
        res.status(500).json('Error updating avatar');
    }
}



/**
 * 1. This function is used for updating the users bio / profile description once they submit the changes
 *    inside the UserProfile.jsx component
 *
 * 2. It requires the ID of the user updating their profile which is sent in the request parameters of
 *    the POST request, and also the bio attached to the request body. If successful, it moves on to the next middleware
 *
 * 3. 500: Server error, log it and display
 *
 *
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */



export const updateUserBio = async (req, res, next) => {
    try {
        if (req.body.bio) { // If no bio, skip this
            const updatedUser = await prisma.users.update({
                data: {
                    bio: req.body.bio, // Update bio
                },
                where: {
                    id: parseInt(req.params.user_id),
                }
            })
            req.bio = updatedUser.bio // Amend the bio to the request object
            next();
        }
        next();
    } catch (err) {
        console.error('Error updating user bio:', err);
        res.status(500).json(`Error updating user bio`);
    }
}


/**
 * 1. This function is more of a helper, binding together the two middleware functions above. So it
 *    parses their responses and sends the final object to the front-end. It is triggered as the last function
 *    in the userRoute.js route
 *
 * 2. It requires that the two previous middleware functions have added bio and avatarUrl to the request object
 *
 * 3. 200: The updated user profile is sent to the front-end
 *    500: Server error, log it and display
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */




export const sendProfileUpdateResponse = async (req, res) => {
    try {
        res.status(200).json({
            bio: req.body.bio, // Added from the updateUserAvatar function
            avatarUrl: req.body.avatarUrl, // Added from the updateUserBio
        })
    } catch (err) {
        console.error(err);
        res.status(500).json('Error sending profile update response');
    }
}
