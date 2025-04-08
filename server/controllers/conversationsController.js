

import {prisma} from '../prisma/index.js';


export const searchForConversations = async (req, res) => {
    try {
        const searchquery = req.params.searchQuery;
        const users = await prisma.users.findMany({
            where: {
                username: {
                    contains: searchquery,
                    mode: "insensitive"
                },
                id: {not: parseInt(req.params.user_id)}
            },
        });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json(`Error: ${error}`);
    }
}


export const getReceiverUsername = async (req, res) => {
    try {
        const username = await prisma.users.findUnique({
            where: {
                id: parseInt(req.params.receiver)
            }
        })
        res.status(200).json(username);
    } catch (err) {
        console.error(err);
        res.status(500).json(`Error: ${err}`);
    }
}



export const getUserConversations = async (req, res) => {

    try {

        const user_id = parseInt(req.params.user_id);
        const conversations = await prisma.friends.findMany({
            where: {
                OR: [
                    { user_id: user_id },
                    { friend_id: user_id }
                ]
            },
            include: {
                User: true,
                Friend: true
            }
        });

        const formattedConversations = await Promise.all(
            conversations.map(async (conversation) => {
                const isUser = conversation.user_id === user_id;
                const friendId = isUser ? conversation.friend_id : conversation.user_id;
                const friend = isUser ? conversation.Friend : conversation.User;


                const latestMessage = await prisma.messages.findFirst({
                    where: {
                        OR: [
                            { sender_id: user_id, receiver_id: friendId },
                            { sender_id: friendId, receiver_id: user_id }
                        ]
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                });

                return {
                    id: friendId,
                    username: friend.username,
                    friend,
                    latestMessage: latestMessage ? {
                        content: latestMessage.content,
                        sender_id: latestMessage.sender_id,
                        created_at: latestMessage.created_at
                    } : null
                };
            })
        );
        res.status(200).json(formattedConversations);
    } catch (err) {
        console.error(err);
        res.status(500).json(`Error: ${err}`);
    }
}

