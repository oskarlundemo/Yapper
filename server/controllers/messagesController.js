



import {prisma} from '../prisma/index.js';

export const sendPrivateMessage = async (req, res) => {
    try {
        console.log('Skicka privat');
        const sender_id = parseInt(req.params.sender_id);
        const receiver_id = parseInt(req.params.receiver_id);

        await prisma.privateMessages.create({
            data: {
                sender_id: sender_id,
                receiver_id: receiver_id,
                content: req.body.message
            }
        })
        res.status(200).json('Successfully sent message');
    } catch (err) {
        console.log(err);
        res.status(500).json(`Error: ${err.message}`);
    }
}


export const createGroupChat = async (req, res) => {
    try {
        const sender_id = parseInt(req.params.sender_id);
        const receivers = req.body.receivers;


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

            // Add each receiver as a group member
            for (const receiver of receivers) {
                await prisma.groupMembers.create({
                    data: {
                        group_id: group.id,
                        member_id: receiver.id,
                    }
                });
            }

            // Create the message with the group.id as receiver_id
            const messageRecord = await prisma.groupMessages.create({
                data: {
                    sender_id: sender_id,
                    group_id: group.id,
                    content: req.body.message,
                }
            });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json(`Error: ${err.message}`);
    }
}

export const sendGroupMessage = async (req, res) => {

    try {
        const sender_id = parseInt(req.params.sender_id);
        const receivers = req.body.receivers;
        const receiver = parseInt(req.params.receiver_id)

        await prisma.groupMessages.create({
            data: {
                sender_id: sender_id,
                group_id: receiver,
                content: req.body.message,
            }
        });

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
                sender: true
            }
        });

        res.status(200).json(messages);

    } catch (err) {
        console.log(err);
        res.status(500).json(`Error: ${err.message}`);
    }
}

export const getMessagesFromGroupConversation = async (req, res) => {

    try {
        const receiver_id = parseInt(req.params.receiver_id);
        const groupMessages = await prisma.groupMessages.findMany({
            where: {
                group_id: receiver_id
            },
            include: {
                sender: true
            }
        })

        res.status(200).json(groupMessages);

    } catch (error) {
        console.log(error);
        res.status(500).json(`Error: ${error.message}`);
    }

}