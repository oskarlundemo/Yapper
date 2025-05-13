import {prisma} from "../prisma/index.js";


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
 * 1. This functions retrieves a list of blocked users that one has user specific user has blocked.
 *    It is called in the DashboardMain.jsx component and triggered when the user logs in
 *
 * 2. It expects the id of the user, which it takes in through the request parameter and is triggered by an GET-request
 *
 * 3. 200: List successfully retrieved and sent to front-end
 *    500: Server error
 * @param req
 * @param res
 * @returns {Promise<void>}
 */


export const getListOfBlockedUsers = async (req, res) => {
    try {

        // Fetch all the blocked users from blocks table
        const listOfBlockedUsers = await prisma.blocks.findMany({
            where: {
                // Where the one who blocked them is the current logged-in user
                blocker: parseInt(req.params.user_id)
            },
            include: {
                // Also include information about the user that were blocked
                BlockedUser: true
            }
        });

        // Success, send it to front end
        res.status(200).json(listOfBlockedUsers);
    } catch (err) {
        console.log(err);

        // Error, display message
        res.status(500).json('Error retrieving block list');
    }
};





/**
 * 1. This function is used to remove blocked user if a user desires to remove it. Basically allowing communications
 *    between them again, which is triggered in UserProfile.jsx component
 *
 * 2. The method expects both id from the user who removes the block and the one who is getting unblocked, taken
 *    in through the DELETE requests parameters. Triggered in the UserProfile.jsx component
 *
 *    req.unblocking_user: User who BLOCKED and is removing it
 *    req.unblocked_user: The user who is getting UNBLOCKED
 *
 *
 * 3. 200: Block was removed, send the updated list to the component
 *    500: Error trying to unblock, show message
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */


export const unblockUser = async (req, res) => {

    try {
        const unblockingUser = parseInt(req.params.unblocking_user); // User who is unblocking the other one
        const unblockedUser = parseInt(req.params.unblocked_user); // User who is getting unblocked
        const loggedInUser = parseInt(req.params.user_id); // Id of the user who is logged in


        const updatedList = loggedInUser ? unblockedUser : unblockingUser;

        // Delete the record of the block in the blocks table
        const block = await prisma.blocks.delete({
            where: {
                blocked_blocker: {
                    blocker: unblockingUser,
                    blocked: unblockedUser
                }
            }
        })


        // If they were friends before, add them again into the friends table
        if (block.friends) {
            await prisma.friends.create({
                data: {
                    user_id: unblockingUser,
                    friend_id: unblockedUser,
                },
            })
        }

        //Send back the updated list of blocked users
        const updateBlockList = await prisma.blocks.findMany({
            where: {
                blocker: updatedList,
            },
            include: {
                BlockedUser: true
            },
        })

        // Updated list of blocked users
        res.status(200).json(updateBlockList);
    } catch (err) {
        // Error fetching list,
        console.log(err);
        res.status(500).json('Error unblocking user');
    }
}



/**
 * 1. This function is used for blocking other users on the plattform, basically refraining contact with them.
 *    It is triggered when the users click 'Block user' in the UserProfile.jsx component
 *
 * 2. It expects the id of both the blocker and blocked user, taken in through the request paramters in
 *    the POST method.
 *
 * 3. 200: User was successfully blocked, send back the updated list
 *    500: Error blocking user
 * @param req
 * @param res
 * @returns {Promise<void>}
 */

export const blockUser = async (req, res) => {
    try {


        const blocker = parseInt(req.params.blocking_user); // ID of use who is blocking
        const blocked = parseInt(req.params.blocked_user) // ID of user is getting blocked

        // First, check if there is a current friendship between the users
        const checkFriendShip = await prisma.friends.findFirst({
            where: {
                OR: [
                    { friend_id: blocked, user_id: blocker },
                    { friend_id: blocker, user_id: blocked },
                ]
            }
        })

        // If there is, set true, else false
        const friends = !!checkFriendShip;

        // Insert a new record into the blocks table, with both ID:s
        await prisma.blocks.create({
            data: {
                blocker: blocker, // User doing the blocking
                blocked: blocked, // User getting blocked
                friends: friends  // Also insert true or false if they were friends
            }
        })

        // If the were friends, then delete that relation the friends table
        if (friends) {
            await prisma.friends.deleteMany({
                where: {
                    OR: [
                        { friend_id: blocked, user_id: blocker },
                        { friend_id: blocker, user_id: blocked }
                    ]
                }
            });
        }

        // Get the updated list of blocked users
        const updatedList = await prisma.blocks.findMany({
            where: {
                blocker: blocker
            },
            include: {
                BlockedUser: true
            }
        })

        // Send back the updated list of blocked users
        res.status(200).json(updatedList);
    } catch (err) {

        console.error(err);    // Display error in backend
        res.status(500).json('Error blocking user, please try again later'); // Error to front-end
    }
}


/**
 * 1. This function is used for updating the users conversation, so once a user has been unblocked, their
 *    previous conersation with the blocker/blocked is displayed. It is triggered in the DashboardConversations.jsx component
 *
 * 2. It expects both the IDs of the user who is blocking and getting unblocked, taken in through
 *    the request parameters in the POST method.
 *
 *
 * 3. 200: User was successfully unblocked and the conversations card is sent to the front-end
 *    500: Error updating conversations with the unblocked user
 * @param req
 * @param res
 * @returns {Promise<void>}
 */


export const userGettingUnblocked = async (req, res) => {


    try {
        const blocker = parseInt(req.params.unblocking_user) // ID of user unblocking the other one
        const blocked = parseInt(req.params.unblocked_user) // ID of user who is getting unblocked
        const loggedIn = parseInt(req.params.logged_in) // ID of the logged-in user
        const respondUser = loggedIn === blocker ? blocked : blocker; // We want to return the opposite user


        // Retreive their latest message between theese users
        const latestMessage = await prisma.privateMessages.findFirst({
            where: {
                OR: [
                    { sender_id: blocker, receiver_id: blocked },
                    { sender_id: blocked, receiver_id: blocker }
                ]
            },
            // Order by the latest desc
            orderBy: {
                created_at: 'desc'
            },
            include: {
                sender: true, // Include information about who sent
                attachments: true, // Include any files
            }
        });

        // Get the information about the opposite user
        const oppositeUser = await prisma.users.findUnique({
            where: {
                id: respondUser,
            }
        })

        // We format the message
        const formattedResponse = {
            user: oppositeUser,
            latestMessage: latestMessage,
        }

        // New updated conversation card sent to the front-end
        res.status(200).json(formattedResponse);

    } catch (err) {
        // Error fetching realtime unblock
        console.error(err);
        res.status(500).json('Error unblocking user, please try again later');
    }
}





