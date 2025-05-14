

import {prisma} from '../prisma/index.js';


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
 * 1. This functions used to create new conversation cards when a new group chat is created. So a user can
 *    click on the card and then enter the group chat. It is triggered in the DashboardConversations.jsx component
 *    once a new group chat is inserted into the DB.
 *
 * 2. It expects both the ID of the new group chat and the logged-in user, taken in through the GET request parameters
 *
 * 3. 200: Send information about the new group and the latest message to the front-end
 *    500: Error fetching the updated information
 */



export const newGroupChat = async (req, res) => {

    try {


        const groupId = parseInt(req.params.group_id); // ID of the group
        const logged_id = parseInt(req.params.user_id); // ID of the logged-in user


        // Find the group chat in the groupChats table
        const groupChat = await prisma.groupChats.findUnique({
            where: {
                id: groupId,
            },
            include: {
                GroupMembers: true // Also include information about the group members
            }
        })

        // Check if the logged-in user is in the new group chat
        const isLoggedInUserInGroup = groupChat.GroupMembers.some(member => member.member_id === logged_id);


        // If they are, update their conversations with the new groupchat
        if (isLoggedInUserInGroup) {
            const groupChatLatestMessage = await prisma.groupMessages.findFirst({
                where: {
                    group_id: groupId,
                },
                include: {
                    sender: true
                },
                orderBy: {
                    created_at: 'desc'
                }
            })

            // Format the groupchat info
            const formattedGroupChat = {
                latestMessage: groupChatLatestMessage,
                group: groupChat
            }

            // Successfully sent info to the front-end
            res.status(200).json(formattedGroupChat)
        }

    } catch (err) {
        console.log(err);
        res.status(500).json('Error updating group, please try again later');
    }
}


/**
 * 1. This function is used for retrieving the information for a group chat once it is created. Triggered
 *    in the DashboardConversations.jsx components, listing for updates into the GroupChats table through the Supabase client
 *
 * 2. It expects the ID of the group chat, sent through the request parameters in a GET-call
 *
 * 3. 200: Successful, send info to the front-end
 *    500: Error, display message
 *
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */



export const newGroupInvite = async (req, res) => {

    try {

        const groupId = parseInt(req.params.group_id); // ID of the new group
        const group = await prisma.groupChats.findUnique({ // Get data for the new group
            where: {
                id: groupId,
            }
        })

        // Fetch the latest message sent in that group chat
        const groupChatLatestMessage = await prisma.groupMessages.findFirst({
            where: {
                group_id: groupId,
            },
            include: {
                sender: true
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        // Format the data before sending
        const formattedNewGroupChat = {
            group: group,
            latestMessage: groupChatLatestMessage
        }

        // Successful
        res.status(200).json(formattedNewGroupChat);
    } catch (err) {
        // Error, display and send info to front-end
        console.log(err);
        res.status(500).json({Message: 'Something went wrong'});
    }
}



/**
 * 1. This function is used for updating the users conversations once a new friend request is sent to them, so
 *    they can enter the chat and respond. It is triggered once another users who are not their friend sends them
 *    a private message, used in DashboardConversations.jsx
 *
 * 2. It expects the ID of the one the user who sent the message, who received it and who is currently
 *    logged in
 *
 * 3. 200: Successful, send info to the front-end
 *    500: Error, display message to front-end
 * @param req
 * @param res
 * @returns {Promise<*>}
 */




export const newPendingNotification = async (req, res) => {

    try {

        const senderId = parseInt(req.params.sender_id); // ID of the sender
        const receiverId = parseInt(req.params.receiver_id); // ID of the recipient of the message
        const currentLoggedIn = parseInt(req.params.logged_in_id); // user who is currently logged in

        const oppositeUserId = currentLoggedIn === senderId ? receiverId : senderId; // Get the ID of the opposite user

        // Get the info of the opposite user
        const user = await prisma.users.findUnique({
            where: {
                id: oppositeUserId,
            },
        });


        // Fetch the latest message between theese two users
        const latestMessage = await prisma.privateMessages.findFirst({
            where: {
                OR: [
                    { sender_id: senderId, receiver_id: receiverId },
                    { sender_id: receiverId, receiver_id: senderId },
                ]
            },
            orderBy: {
                created_at: 'desc'
            },
            include: {
                sender: true
            },
            take: 1
        });

        // Reformat before sending
        const newConvo = {
            user,
            latestMessage,
        }

        return res.status(200).json(newConvo); // Successful

    } catch (err) {
        console.log(err); // Error, log it
        res.status(500).json({Message: 'Something went wrong updating the conversations'});
    }

}



/**
 * 1. This functions is used for loading and showing the logged-in users conversations. It is triggered in the DashboardConversations.jsx upon
 *   logging in
 *
 * 2. It expects the ID of the user who logged in
 *
 *
 * 3. 200: List of the users conversations
 *    500: Error, log it
 * @param req
 * @param res
 * @returns {Promise<void>}
 */




export const getAllConversations = async (req, res) => {

    try {
        const user_id = parseInt(req.params.user_id); // Get the ID of the logged-in user

        // Find all their friends
        const friends = await prisma.friends.findMany({
            where: {
                OR: [
                    { user_id },
                    { friend_id: user_id }
                ]
            },
            include: {
                User: true,
                Friend: true
            }
        });

        // Check if they have any pending friend requests from other users
        const pendingRequests = await prisma.pendingFriendRequests.findMany({
            where: {
                receiver_id: user_id
            },
            include: {
                Sender: true
            }
        });


        // Reformat their friends
        const formattedFriends = await Promise.all(
            friends.map(async (relation) => {
                const otherUser = relation.User.id === user_id ? relation.Friend : relation.User; // Get the opposite user


                // Find the latest message between theese two friends
                const latestMessage = await prisma.privateMessages.findFirst({
                    where: {
                        OR: [
                            { sender_id: user_id, receiver_id: otherUser.id },
                            { sender_id: otherUser.id, receiver_id: user_id }
                        ]
                    },
                    orderBy: {
                        created_at: 'desc'
                    },
                    include: {
                        sender: true,
                        attachments: true,
                    }
                });

                // Reformatted
                return {
                    status: "friend",
                    user: {
                        id: otherUser.id,
                        username: otherUser.username,
                        avatar: otherUser.avatar,
                        email: otherUser.email
                    },
                    latestMessage: latestMessage
                        ? {
                            content: latestMessage.content,
                            created_at: latestMessage.created_at,
                            hasAttachments: latestMessage.attachments.length > 0,
                            sender: {
                                id: latestMessage.sender.id,
                                username: latestMessage.sender.username
                            }
                        } : null
                };
            })
        );


        // Reformat pending requests
        const formattedPending = await Promise.all(
            pendingRequests.map(async (request) => {
                const sender = request.Sender; // Get info about the one who sent the request


                // Find the last message between theese two users
                const latestMessage = await prisma.privateMessages.findFirst({
                    where: {
                        OR: [
                            { sender_id: user_id, receiver_id: sender.id },
                            { sender_id: sender.id, receiver_id: user_id }
                        ]
                    },
                    orderBy: {
                        created_at: 'desc'
                    },
                    include: {
                        sender: true
                    }
                });

                // Reformat and return
                return {
                    status: "pending",
                    user: {
                        id: sender.id,
                        username: sender.username,
                        avatar: sender.avatar,
                        email: sender.email
                    },
                    latestMessage: latestMessage
                        ? {
                            content: latestMessage.content,
                            created_at: latestMessage.created_at,
                            sender: {
                                id: latestMessage.sender.id,
                                username: latestMessage.sender.username
                            }
                        }
                        : null
                };
            })
        );


        // Find the logged-in users group chats
        const usersGroupChat = await prisma.groupMembers.findMany({
            where: {
                member_id: parseInt(req.params.user_id)
            },
            include: {
                Member: true,
                Group: {
                    include: {
                        // Include the last message sent in that chat
                        GroupMessages: {
                            include: {
                                sender: true,
                                attachments: true,
                            },
                            orderBy: {
                                created_at: 'desc'
                            },
                            take: 1
                        },

                        // Include the members
                        GroupMembers: {
                            include: {
                                Member: true
                            }
                        }
                    }
                }
            }
        });


        // Reformat the group chats
        const formattedGroupChats = usersGroupChat.map((chat) => {
            const group = chat.Group;

            // Only send the latest message
            const latestMessage = group.GroupMessages[0];

            // If the group has no name or it is null, set it to the groupMembers name
            const groupName = group.name
                ? group.name
                : group.GroupMembers.map((m) => m.Member.username).join(', ');

            return {
                group: {
                    id: group.id,
                    name: groupName,
                    avatar: group.avatar,
                },
                latestMessage: latestMessage
                    ? {
                        content: latestMessage.content,
                        created_at: latestMessage.created_at,
                        hasAttachments: latestMessage.attachments.length > 0,
                        sender: {
                            id: latestMessage.sender.id,
                            username: latestMessage.sender.username,
                        },
                    }
                    : null,
            };
        });


        // Merge all the different arrays together
        const conversations = [...formattedFriends, ...formattedPending];
        const mergedPrivateAndGrops = [...conversations, ...formattedGroupChats];

        // Sort them by the timestamp of the latestMessage
        const sortedConversations = mergedPrivateAndGrops.sort((a, b) =>
            new Date(b.latestMessage?.created_at || 0) - new Date(a.latestMessage?.created_at || 0)
        );

        // Successful, send it to the front-end
        res.status(200).json(sortedConversations);

    } catch (error) {
        console.error(error); // Error, log it
        res.status(500).json('Error retrieving conversations');
    }
}



/**
 * 1. This function retrieves the latest message inserted into the privateMessages table, which is then
 *    passed on to the PrivateConversationsCard.jsx component that updates its state. So the PrivateConversationsCard.jsx
 *    checks if the latest message is related to that conversations, and updates its self or not
 *
 * 2. It expects the ID:s of the sender, receiver and the message itself. Which is sent through the request paratmer
 *    of the GET-call.
 *
 * 3. 200: Returns the latest message
 *    500: Error, log it
 *
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */



export const fetchNewPrivateMessage = async (req, res) => {

    try {
        const messageId = parseInt(req.params.message_id); // ID of the message
        const senderId = parseInt(req.params.sender_id); // ID of the one who sent it
        const receiverId = parseInt(req.params.receiver_id); // ID of the one receiving it

        const loggedInUser = parseInt(req.params.logged_in) // ID of currently logged-in user
        const receivingUser = loggedInUser === senderId ? receiverId : senderId; // Retrieve the opposite user ID

        // Find the message
        const message = await prisma.privateMessages.findUnique({
            where: {
                id: messageId
            },
            include: {
                sender: true, // Info about who sent it
                attachments: true,
            }
        });

        // Include the attached files


        // Find the opposite user
        const user = await prisma.users.findUnique({
            where: {
                id: receivingUser
            }
        })

        // If there are any files, true else false
        message.hasAttachments = message.attachments.length > 0

        // Format message
        const formattedMessage = {
            latestMessage: message,
            user: user,
        }

        // Successful, send to the front-end
        res.status(200).json(formattedMessage);

    } catch (err) {
        console.error(err); // Error, log it
        res.status(500).json('Error retrieving conversations');
    }
}




