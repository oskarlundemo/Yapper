

import {prisma} from '../prisma/index.js';




export const newGroupChat = async (req, res) => {

    try {

        const groupId = parseInt(req.params.group_id);
        const logged_id = parseInt(req.params.user_id);


        const groupChat = await prisma.groupChats.findUnique({
            where: {
                id: groupId,
            },
            include: {
                GroupMembers: true
            }
        })

        const isLoggedInUserInGroup = groupChat.GroupMembers.some(member => member.member_id === logged_id);

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

            const formattedGroupChat = {
                latestMessage: groupChatLatestMessage,
                group: groupChat
            }
            res.status(200).json(formattedGroupChat)
        }

    } catch (err) {
        console.log(err);
    }
}





export const newGroupInvite = async (req, res) => {

    try {

        const groupId = parseInt(req.params.group_id);
        const group = await prisma.groupChats.findUnique({
            where: {
                id: groupId,
            }
        })

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

        const formattedNewGroupChat = {
            group: group,
            latestMessage: groupChatLatestMessage
        }

        res.status(200).json(formattedNewGroupChat);
    } catch (err) {
        console.log(err);
        res.status(500).json({Message: 'Something went wrong'});
    }
}



export const newPendingNotification = async (req, res) => {

    try {

        const senderId = parseInt(req.params.sender_id);
        const receiverId = parseInt(req.params.receiver_id);
        const currentLoggedIn = parseInt(req.params.logged_in_id); // pass this properly

        const oppositeUserId = currentLoggedIn === senderId ? receiverId : senderId;

        const user = await prisma.users.findUnique({
            where: {
                id: oppositeUserId,
            },
        });

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

        const newConvo = {
            user,
            latestMessage,
        }

        return res.status(200).json(newConvo);

    } catch (err) {
        console.log(err);
        res.status(500).json({Message: 'Something went wrong'});
    }

}





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
                        sender: true,
                        attachments: true,
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
                            hasAttachments: latestMessage.attachments.length > 0,
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
                                AttachedFile: true,
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
                    avatar: group.avatar,
                },
                latestMessage: latestMessage
                    ? {
                        content: latestMessage.content,
                        created_at: latestMessage.created_at,
                        hasAttachments: latestMessage.AttachedFile,
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

        const sortedConversations = mergedPrivateAndGrops.sort((a, b) =>
            new Date(b.latestMessage?.created_at || 0) - new Date(a.latestMessage?.created_at || 0)
        );


        res.status(200).json(sortedConversations);

    } catch (error) {
        console.error(error);
        res.status(500).json(`Error: ${error}`);
    }
}


export const fetchNewPrivateMessageInfo = async (req, res) => {

    try {
        const messageId = parseInt(req.params.message_id);
        const senderId = parseInt(req.params.sender_id);
        const receiverId = parseInt(req.params.receiver_id);

        const loggedInUser = parseInt(req.params.logged_in)
        const receivingUser = loggedInUser === senderId ? receiverId : senderId;

        const message = await prisma.privateMessages.findUnique({
            where: {
                id: messageId
            },
            include: {
                sender: true,
            }
        });


        const attachments = await prisma.attachedFile.findMany({
            where: {
                private_message_id: messageId
            }
        })

        const user = await prisma.users.findUnique({
            where: {
                id: receivingUser
            }
        })

        message.hasAttachments = attachments.length > 0

        const formattedMessage = {
            latestMessage: message,
            user: user,
        }

        res.status(200).json(formattedMessage);

    } catch (err) {
        res.status(500).json(`Error: ${err.message}`);
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
