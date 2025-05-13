

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
 * 1. This function is used for retrieving the users friends list, which is triggered in the DashboardMain.jsx
 *    component
 *
 * 2. It expects the ID of the logged-in user which is sent through the request parameters in the GET call.
 *
 * 3. 200: List of the users friends
 *    500: Server error, log and display
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */


export const getFriendsList = async (req, res) => {
    try {

        // Get all the friends from the friends table
        const friendsList = await prisma.friends.findMany({
            where: {
                OR: [
                    { user_id: parseInt(req.params.user_id) }, // Where the u
                    { friend_id: parseInt(req.params.user_id) },
                ],
            },
            include: {
                User: true,
                Friend: true,
            }
        });

        const formatedFriends = await Promise.all(
            friendsList.map(async (contact) => {
                const isUser = contact.user_id === parseInt(req.params.user_id);
                const friendId = isUser ? contact.friend_id : contact.user_id;
                const friend = isUser ? contact.Friend : contact.User

                return {
                    id: friendId,
                    username: friend.username,
                    friend
                }
            })
        )
        res.status(200).json(formatedFriends);
    } catch (e) {
        console.error(e);
        res.status(500).send('Not Found');
    }
}





/**
 * 1. This function is used for accepting pending friend requests when a user respons to a new contact.
 *    Which is triggered in the DashboardMessageArea.jsx component when the user responds to a message
 *
 *
 * 2. It expects the ID of both the receiver and the sender of the message taken in through the
 *    request parameter in te GET call.
 *
 * 3. 404: No pending friend request found
 *    200: Friend reuses accepted
 *    500: Error, display and log it
 * @param req
 * @param res
 * @returns {Promise<void>}
 */





export const acceptRequest = async (req, res) => {
    try {

        const senderId = parseInt(req.params.sender_id); // ID of sender
        const receiverId = parseInt(req.params.receiver_id); // ID of recipient

        // Check if there is any pending requests
        const request = await prisma.pendingFriendRequests.findFirst({
            where: {
                OR: [
                    { sender_id: senderId, receiver_id: receiverId },
                    { sender_id: receiverId, receiver_id: senderId },
                ]
            }
        })

        // If there is one
        if (request) {
            await prisma.$transaction([

                // Delete the request
                prisma.pendingFriendRequests.delete({
                    where: {
                        sender_id_receiver_id: {
                            receiver_id: receiverId,
                            sender_id: senderId,
                        }
                    }
                }),

                // Add ass friend
                prisma.friends.create({
                    data: {
                        user_id: parseInt(req.params.sender_id),
                        friend_id: parseInt(req.params.receiver_id)
                    }
                }),
            ]);
            // Successfully created friends
            res.status(200).send('Successfully accepted friend');
            return;
        }
        // No friends request fround
        res.status(404).send('No friend request found.');
    } catch (err) {
        console.error(err);
        res.status(500).send(`Error accepting the friend request`);
    }
}




/**
 *
 * 1. This functions is used for checking if the user and the recipient are already friends, which is triggered in
 *    the DashbordContext.jsx when a user inspects a conversations
 *
 * 2. It expects the ID of the sender and receiver
 *
 * 3. 200: Users are friends = true
 *    500: Server error, log it
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */


export const checkFriendship = async (req, res) => {
    try {
        const senderId = parseInt(req.params.sender_id); // ID of sender
        const receiverId = parseInt(req.params.receiver_id); // ID of receiver

        if (isNaN(senderId) || isNaN(receiverId)) {
            return res.status(400).json({ error: "Invalid sender or receiver ID." });
        }


        // Check if there is a friend record in the friends table
        const friends = await prisma.friends.findFirst({
            where: {
                OR: [
                    { user_id: senderId, friend_id: receiverId },
                    { user_id: receiverId, friend_id: senderId }
                ]
            }
        });

        // If it is, the true, else false
        const isFriends = !!friends;

        // Successful
        res.status(200).json(isFriends);
    } catch (err) {
        console.error("Error checking friendship:", err);
        res.status(500).json({ error: 'Error checking friendship' });
    }
};
