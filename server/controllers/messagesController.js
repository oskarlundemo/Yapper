import {prisma} from '../prisma/index.js';
import {saveFiles} from "./supabaseController.js";


export const sendGifGroupChat = async (req, res) => {
    try {
        const sender = parseInt(req.params.sender_id);
        const receiver = parseInt(req.params.receiver_id);

        if (!receiver && req.body.receivers.length > 1) {
            await createGroupChat(req, res)
            return;
        }

        const gif = req.body.gif;

        await prisma.groupMessages.create({
            data: {
                sender_id: sender,
                group_id: receiver,
                content: gif.images.original.url,
            }
        })

    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
}



export const sendGifPrivateConversation = async (req, res) => {

    try {

        const sender = parseInt(req.params.sender_id);
        const receiver = parseInt(req.params.receiver_id);
        const gif = req.body.gif;

        await prisma.privateMessages.create({
            data: {
                sender_id: sender,
                receiver_id: receiver,
                content: gif.images.original.url,
            }
        })

    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
}




export const sendPrivateMessage = async (req, res) => {
    try {
        const senderId = parseInt(req.params.sender_id);
        let receiverArray = JSON.parse(req.body.receivers);
        const receiverIdParams = parseInt(req.params.receiver_id);
        const receiverBody = receiverArray[0]?.id;
        const receiverId = isNaN(receiverIdParams) ? parseInt(receiverBody) : parseInt(receiverIdParams);


        await prisma.$transaction(async () => {
            const message = await prisma.privateMessages.create({
                data: {
                    sender_id: senderId,
                    receiver_id: receiverId,
                    content: req.body.message
                }
            });

            if (req.files) {
                await prisma.$transaction(async () => {
                    const files = req.files;
                    for (const file of files) {

                        const newFile = await prisma.file.create({
                            data: {
                                path: file.originalname,
                                size: file.size,
                            }
                        })

                        await prisma.attachedFile.create({
                            data: {
                                private_message_id: message.id,
                                file_id: newFile.id
                            }
                        })
                    }

                    await saveFiles(req, res);
                })
            }


            const request = await prisma.pendingFriendRequests.findFirst({
                where: {
                    OR: [
                        { sender_id: senderId, receiver_id: receiverId },
                        { sender_id: receiverId, receiver_id: senderId },
                    ]
                }
            });

            const friends = await prisma.friends.findFirst({
                where: {
                    OR: [
                        { friend_id: senderId, user_id: receiverId },
                        { friend_id: receiverId, user_id: senderId },
                    ]
                }
            });

            if (!request && !friends) {
                await prisma.pendingFriendRequests.create({
                    data: {
                        sender_id: senderId,
                        receiver_id: receiverId
                    }
                });
            }
        });

        res.status(200).json('Successfully sent message');
    } catch (err) {
        console.log(err);
        res.status(500).json(`Error: ${err.message}`);
    }
}


export const newPrivateMessage = async (req, res) => {

    try {
        const msgId = parseInt(req.params.message_id);

        const message = await prisma.privateMessages.findUnique({
            where: {
                id: msgId
            }, include: {
                attachments: true,
                sender: true
            }
        })

        const files = await prisma.attachedFile.findMany({
            where: {
                private_message_id: msgId
            },
            include: {
                file: true
            }
        })

        if (files)
            message.attachments = files;

        res.status(200).json(message);

    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}


export const newGroupMessage = async (req, res) => {

    try {
        const group_id = parseInt(req.params.group_id);
        const message_id = parseInt(req.params.message_id);

        const groupMessage = await prisma.groupMessages.findFirst({
            where: {
                group_id: group_id,
                id: message_id
            },
            include: {
                sender: true,
                AttachedFile: {
                    include: {
                        file: true
                    }
                }
            }
        });

        groupMessage.hasAttachments = groupMessage?.AttachedFile.length > 0;

        res.status(200).json(groupMessage);

    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}



export const createGroupChat = async (req, res) => {
    try {

        const sender_id = parseInt(req.params.sender_id);
        const receivers = typeof req.body.receivers === 'string' ? JSON.parse(req.body.receivers) : req.body.receivers;

        let groupName = req.body.name;

        const result = await prisma.$transaction(async (prisma) => {

            const group = await prisma.groupChats.create({
                data: {
                    admin_id: sender_id,
                }
            });

            const addAdminToGroup = await prisma.groupMembers.create({
                data: {
                    group_id: group.id,
                    member_id: sender_id
                }
            })

            for (const user of receivers) {
                await prisma.groupMembers.create({
                    data: {
                        group_id: group.id,
                        member_id: user.id,
                    }
                });
            }


            if (!groupName) {
                const namesOfGroupMembers = await prisma.groupMembers.findMany({
                    where: {group_id: group.id}, include: {Member: true}
                })

                groupName = namesOfGroupMembers.map((member) => member.Member.username).join(', ');

                await prisma.groupChats.update({
                    data: {
                        name: groupName,
                    },
                    where: {
                        id: group.id,
                    }
                })
            }

            await prisma.groupMessages.create({
                data: {
                    sender_id: sender_id,
                    group_id: group.id,
                    content: req.body.message ? req.body.message : req.body.gif.images.original.url
                }
            });

            return group;
        });

        res.status(200).json({result});

    } catch (err) {
        console.log(err);
        res.status(500).json(`Error: ${err.message}`);
    }
}

export const sendGroupMessage = async (req, res) => {

    try {

        const sender_id = parseInt(req.params.sender_id);
        const receiver = parseInt(req.params.receiver_id)


        const message = await prisma.groupMessages.create({
            data: {
                sender_id: sender_id,
                group_id: receiver,
                content: req.body.message,
            }
        });


        if (req.files.length > 0) {
            await prisma.$transaction(async () => {
                const files = req.files;
                for (const file of files) {

                    const newFile = await prisma.file.create({
                        data: {
                            path: file.originalname,
                            size: file.size,
                        }
                    })

                    await prisma.attachedFile.create({
                        data: {
                            group_message_id: message.id,
                            file_id: newFile.id
                        }
                    })
                }

                console.log('Skickades med filer')
                await saveFiles(req, res);
            })
        }
        res.status(200).json('Successfully sent message');
    } catch (err) {
        console.log(err);
        res.status(500).json(`Error: ${err.message}`);
    }
}



export const getMessagesFromPrivateConversation = async (req, res) => {

    try {
        const sender_id = parseInt(req.params.sender_id);
        const receiver_id = parseInt(req.params.receiver_id);

        const messages = await prisma.privateMessages.findMany({
            where: {
                OR: [
                    { sender_id: sender_id, receiver_id: receiver_id },
                    { sender_id: receiver_id, receiver_id: sender_id },
                ]
            },
            orderBy: {
                created_at: 'asc'
            },
            include: {
                sender: true,
                attachments: {
                    include: {
                        file: true,
                    }
                }
            }
        });


        const otherUser = await prisma.users.findUnique({
            where: {
                id: receiver_id,
            }
        })

        res.status(200).json({messages, otherUser});

    } catch (err) {
        console.log(err);
        res.status(500).json(`Error: ${err.message}`);
    }
}


export const getMessagesFromGroupConversation = async (req, res) => {
    try {
        const groupId = parseInt(req.params.receiver_id);

        const groupMessages = await prisma.groupMessages.findMany({
            where: { group_id: groupId },
            include: {
                sender: true,
                AttachedFile: {
                    include: { file: true }
                },
            },
            orderBy: { created_at: 'asc' }
        });

        const group = await prisma.groupChats.findUnique({
            where: {
                id: groupId
            },
            include: {
                GroupMembers: {
                    include: {
                        Member: true,
                    }
                }
            }
        })

        return res.status(200).json({groupMessages, group});
    } catch (error) {
        console.error(error);
        return res.status(500).json(`Error: ${error.message}`);
    }
};