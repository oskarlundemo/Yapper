

import {prisma} from '../prisma/index.js';


export const getAllConversations = async (req, res) => {

    try {
        const user_id = parseInt(req.params.user_id);

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

        const pendingRequests = await prisma.pendingFriendRequests.findMany({
            where: {
                receiver_id: user_id
            },
            include: {
                Sender: true
            }
        });


        const formattedFriends = await Promise.all(
            friends.map(async (relation) => {
                const otherUser = relation.User.id === user_id ? relation.Friend : relation.User;

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
                        sender: true
                    }
                });

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
                            sender: {
                                id: latestMessage.sender.id,
                                username: latestMessage.sender.username
                            }
                        } : null
                };
            })
        );


        const formattedPending = await Promise.all(
            pendingRequests.map(async (request) => {
                const sender = request.Sender;

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

        const usersGroupChat = await prisma.groupMembers.findMany({
            where: {
                member_id: parseInt(req.params.user_id)
            },
            include: {
                Member: true,
                Group: {
                    include: {
                        GroupMessages: {
                            include: {
                                sender: true,
                            },
                            orderBy: {
                                created_at: 'desc'
                            },
                            take: 1
                        },
                        GroupMembers: {
                            include: {
                                Member: true
                            }
                        }
                    }
                }
            }
        });


        const formattedGroupChats = usersGroupChat.map((chat) => {
            const group = chat.Group;

            const latestMessage = group.GroupMessages[0];


            const groupName = group.name
                ? group.name
                : group.GroupMembers.map((m) => m.Member.username).join(', ');

            return {
                group: {
                    id: group.id,
                    name: groupName,
                },
                latestMessage: latestMessage
                    ? {
                        content: latestMessage.content,
                        created_at: latestMessage.created_at,
                        sender: {
                            id: latestMessage.sender.id,
                            username: latestMessage.sender.username,
                        },
                    }
                    : null,
            };
        });


        const conversations = [...formattedFriends, ...formattedPending];
        const mergedPrivateAndGrops = [...conversations, ...formattedGroupChats];

        res.status(200).json(mergedPrivateAndGrops);

    } catch (error) {
        console.error(error);
        res.status(500).json(`Error: ${error}`);
    }
}




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
