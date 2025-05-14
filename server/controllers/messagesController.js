import {prisma} from '../prisma/index.js';
import {saveFilesFromConversations} from "./supabaseController.js";


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
 * 1. This function is used for sending GIF:s in the group chats. Triggered in the GifContainer.jsx component
 *    once a user clicks on a GIF they want to send, then depending if they are sending it to a group chat or
 *    private conversations, this function or sendGifPrivateConversations is triggered, check messsagesRouter for that selection
 *
 * 2. It expects that the GIF is passed through the request body, the receivers are sent as an array in
 *    and the ID of the receiver and sender in a POST-request
 *
 * 3. 200: Gif was successfully sent in the chat
 *    500: Server error, display it and log it
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */



export const sendGifGroupChat = async (req, res) => {
    try {
        const sender = parseInt(req.params.sender_id); // Parse ID of sender
        const receiver = parseInt(req.params.receiver_id); // Parse ID of receiving group


        /**
         * If there is no receiver, that means that the user is trying to start a
         * new group chat and want the first message to be a GIF
         */

        if (!receiver && req.body.receivers.length > 1) {
            await createGroupChat(req, res) // Create new group chat
            return;
        }

        const gif = req.body.gif;  // Parse the GIF

        await prisma.groupMessages.create({ // Create the message
            data: {
                sender_id: sender,
                group_id: receiver,
                content: gif.images.original.url,
            }
        })
        res.status(200).json({message: 'Successfully created!'}); // Successful
    } catch (err) {
        console.log(err); // Error, log it
        res.status(500).json('Internal Server Error');
    }
}


/**
 * 1. This function is used for sending GIF:s in private messages. Triggered in the GifContainer.jsx component
 *    once a user clicks on a GIF they want to send, then depending on if they are sending it to a group chat or
 *    private conversations, this function or sendGifGroupChat is triggered, check messsagesRouter for that selection
 *
 * 2. It expects that the GIF is passed through the request body, the receivers are sent as an array in
 *    and the ID of the receiver and sender in a POST-request
 *
 * 3. 200: Gif was successfully sent in the chat
 *    500: Server error, display it and log it
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */



export const sendGifPrivateConversation = async (req, res) => {

    try {
        const sender = parseInt(req.params.sender_id); // ID of sender
        const receiver = parseInt(req.params.receiver_id); // ID of receiver
        const gif = req.body.gif;

        await prisma.privateMessages.create({ // Create the message
            data: {
                sender_id: sender,
                receiver_id: receiver,
                content: gif.images.original.url,
            }
        })

        res.status(200).json({message: 'Successfully created!'});

    } catch (err) {
        console.log(err);
        res.status(500).json('Internal Server Error');
    }
}


/**
 * 1. This function is used for sending private messages between users. Triggered in the DashboardMessageArea.jsx
 *    once a users hits submit / enter. Then depending on if the chat is a group chat or a private conversation, either sendPrivateMessage or
 *    sendGroupMessage is triggered, check messagesRoute for that condition
 *
 * 2. It expects the ID of the sender and receiver passed through the request parameters and also the array of receivers
 *    sent via the request body in POST request
 *
 * 3. 200: Successfully sent the message to the other user
 *    500: Server error, log it and display it
 *
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */


export const sendPrivateMessage = async (req, res) => {
    try {


        const senderId = parseInt(req.params.sender_id); // Parse sender ID
        let receiverArray = JSON.parse(req.body.receivers); // Parse the recipient of the message, this is when there is a new conversation
        const receiverIdParams = parseInt(req.params.receiver_id); // Parse the ID of the receipt
        const receiverBody = receiverArray[0]?.id;


        // If there is a new conversation, then the recipient is in the array, otherwise use the id sent through the request parameter
        const receiverId = isNaN(receiverIdParams) ? parseInt(receiverBody) : parseInt(receiverIdParams);



        // Create message
        const message = await prisma.privateMessages.create({
            data: {
                sender_id: senderId,
                receiver_id: receiverId,
                content: req.body.message
            }
        });

        req.messageID = message.id;

        // If there are any files attached to the message, parse and upload them
        if (req.files) {
            await saveFilesFromConversations(req, res); // Upload to Supabase
        }


        // Check if there is a pending friend request between the users
        const pendingFriendRequest = await prisma.pendingFriendRequests.findFirst({
            where: {
                OR: [
                    { sender_id: senderId, receiver_id: receiverId },
                    { sender_id: receiverId, receiver_id: senderId },
                ]
            }
        });

        // Check if the users are friends
        const friendShip = await prisma.friends.findFirst({
            where: {
                OR: [
                    { friend_id: senderId, user_id: receiverId },
                    { friend_id: receiverId, user_id: senderId },
                ]
            }
        });

        // If they are neither friends or have a pending request, create one
        if (!pendingFriendRequest && !friendShip) {
            await prisma.pendingFriendRequests.create({
                data: {
                    sender_id: senderId,
                    receiver_id: receiverId
                }
            });
        }


        res.status(200).json('Successfully sent message');
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

/**
 * 1. This function is used for fetching the data associated with a new private message between two
 *    users. It is triggered by the Supabase client in the DashboardChatWindow.jsx component once a
 *    new message is added to the PrivateMessages table
 *
 * 2. It expects that the ID of the new message is sent through the request parameters in a POST requst
 *
 * 3. 200: Successful, send back the message data
 *    500: Server error, log it display it
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */



export const fetchNewPrivateMessage = async (req, res) => {
    try {
        const messageID = parseInt(req.params.message_id); // Parse the ID of the message

        console.log("Fetching message with ID:", messageID); // Ensure you're getting the correct ID.

        const message = await prisma.privateMessages.findUnique({
            where: { id: messageID },  // Ensure you're fetching based on the message ID
            include: {
                sender: true,
                attachments: true,
            }
        });

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        const attachments = await prisma.privateMessagesAttachment.findMany({
            where: { message_id: messageID }
        });
        console.log(attachments);

        console.log(message);  // Check the message and attachments

        res.status(200).json(message); // Successful, send message

    } catch (err) {
        console.log(err);
        res.status(500).send('Error fetching latest private message');
    }
}


/**
 * 1. This function is used for fetching the data associated with a new group message in a group chat
 *    It is triggered by the Supabase client in the DashboardChatWindow.jsx component once a
 *    new message is added to the PrivateMessages table
 *
 * 2. It expects that the ID of the new message and the ID of the group is sent through the request parameters
 *    in a POST requst.
 *
 * 3. 200: Successful, send back the message data
 *    500: Server error, log it display it
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */


export const fetchNewGroupMessage = async (req, res) => {

    try {
        const groupID = parseInt(req.params.group_id);
        const messageID = parseInt(req.params.message_id);

        const groupMessage = await prisma.groupMessages.findFirst({
            where: {
                group_id: groupID,
                id: messageID
            },
            include: {
                sender: true, // Include information about sender
                attachments: true,
            }
        });

        console.log('Fetched new group message');
        console.log(groupMessage);

        res.status(200).json(groupMessage); // Successful, send it to the front end
    } catch (err) {
        console.log(err);
        res.status(500).send('Error fetching latest group message');
    }
}


/**
 * 1. This function is used for creating new group chats. Which is triggered once a user initiates a new conversation
 *    with more recipients than one in, and it occurs once they submit their message in the DashboardMessageArea.jsx component.
 *
 * 2. It expects the ID of the sender in the request parameter, the recipients of the message in the array from the request body and
 *    the name of the group chat
 *
 *
 * 3. 200: Successfully created a new group chat and sent data to the front-end
 *    500: Server error, log it and display
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */





export const createGroupChat = async (req, res) => {
    try {

        const senderID = parseInt(req.params.sender_id); // Parse the ID
        const receivers = typeof req.body.receivers === 'string' ? JSON.parse(req.body.receivers) : req.body.receivers; // Sometimes receiver is a JSON.Stringify object, other times it is just attached to the body

        let groupName = req.body.name; // Group name

        const newGroupChat = await prisma.$transaction(async (prisma) => {

            // Create the group itself
            const group = await prisma.groupChats.create({
                data: {
                    admin_id: senderID,
                }
            });

            // The creator of the group is by default set to admin
            await prisma.groupMembers.create({
                data: {
                    group_id: group.id,
                    member_id: senderID
                }
            })

            // For each member in the array of receivers, add them into group member table
            for (const user of receivers) {
                await prisma.groupMembers.create({
                    data: {
                        group_id: group.id, // ID of group
                        member_id: user.id, // ID of user
                    }
                });
            }


            // If there is no group name, set it by default to all the names of the group members
            if (!groupName) {

                // Fetch all names in the group
                const namesOfGroupMembers = await prisma.groupMembers.findMany({
                    where: {group_id: group.id}, include: {Member: true}
                })

                // Join them together
                groupName = namesOfGroupMembers.map((member) => member.Member.username).join(', ');

                // Update the group chat mame
                await prisma.groupChats.update({
                    data: {
                        name: groupName,
                    },
                    where: {
                        id: group.id,
                    }
                })
            }

            //Insert the first message in the group
            await prisma.groupMessages.create({
                data: {
                    sender_id: senderID, // Sender ID
                    group_id: group.id, // Group ID
                    content: req.body.message ? req.body.message : req.body.gif.images.original.url // Insert either a message or the gif reference
                }
            });

            return group;
        });

        // Successful, send the new group chat back to the front end
        res.status(200).json({result: newGroupChat});

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Error creating group chat'});
    }
}


/**
 * 1. This function is used for sending a message inside a group chat. It is triggered once a user
 *    hits submit in the DashboardTextArea.jsx component through a POST request.
 *
 * 2. It requires the ID of the sender and receiver of the message, where the receiver is the group.
 *
 * 3. 200: Successfully sent message
 *    500: Server error, log it
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */


export const sendGroupMessage = async (req, res) => {

    try {

        const senderID = parseInt(req.params.sender_id); // Sender
        const groupID = parseInt(req.params.receiver_id) // Group


        // Insert the new message
        const message = await prisma.groupMessages.create({
            data: {
                sender_id: senderID,
                group_id: groupID,
                content: req.body.message, // Message
            }
        });

        req.messageID = message.id;
        // If there are any files
        if (req.files) {
            await saveFilesFromConversations(req, res); // Upload to Supabase, see supabaseController.js
        }

        res.status(200).json('Successfully sent message'); // Succuesfull
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Error sending group message'});
    }
}


/**
 * 1. This functions is used for fetching all the messages associated between two users in a private conversation.
 *    It is triggered in the once a user click on a PrivateConversationCard.jsx component, which then calls the function
 *    inside the DashboardContext.jsx context. It returns an array containg all the messages between the two users and
 *    data about the opposite receiver
 *
 * 2. It expects the ID of both the user inspecting the conversation and the user who is inspected, taken in through
 *    the request parameters in a GET call.
 *
 *
 * 3. 200: Successful, send back the messages and data about the other user
 *    500: Server error, log it and display
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */



export const getMessagesFromPrivateConversation = async (req, res) => {

    try {
        const inspectingUser = parseInt(req.params.inspector_id); // User who clicks on the other
        const inspectedUser = parseInt(req.params.inspected_id); // User who gets clicked on

        // Find all the messages
        const messages = await prisma.privateMessages.findMany({
            where: {
                OR: [
                    { sender_id: inspectingUser, receiver_id: inspectedUser },
                    { sender_id: inspectedUser, receiver_id: inspectingUser },
                ]
            },
            orderBy: {
                created_at: 'asc'
            },
            include: {
                sender: true, // Include information about the sender
                attachments: true,  // Include attachments aswell
            }
        });


        // Get the data of the other user
        const otherUser = await prisma.users.findUnique({
            where: {
                id: inspectedUser,
            }
        })

        res.status(200).json({messages, otherUser});

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Error getting messages for private conversation'});
    }
}

/**
 * 1. This function is used for getting all the messages in a group chat and displaying them for the user.
 *    It is triggered once a user clicks on a group chat, that then fires the inspectGroupChat function inside
 *    the DashboardContext.jsx context. It returns data about the messages in the group chat and about the group
 *
 * 2. It requires the ID of the group chat to inspect, which is sent through the request paramters in the GET call.
 *
 *
 * 3. 200: Successful, send back the messages and data about the group
 *    500: Server error, log it and display
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */


export const getMessagesFromGroupConversation = async (req, res) => {
    try {
        const groupID = parseInt(req.params.receiver_id); // Parse the group ID

        // Fetch all the messages associated with that group
        const groupMessages = await prisma.groupMessages.findMany({
            where: { group_id: groupID },
            include: {
                sender: true, // Include info about the author / sender of the message
                attachments: true, // Also include the files that might be associated with a message,
            },
            orderBy: { created_at: 'asc' }
        });

        // Fetch the information associated with that group
        const group = await prisma.groupChats.findUnique({
            where: {
                id: groupID
            },
            include: {
                GroupMembers: {
                    include: {
                        Member: true,
                    }
                }
            }
        })

        // Return the messages and the group information
        return res.status(200).json({groupMessages, group});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Error loading group messages'});
    }
};