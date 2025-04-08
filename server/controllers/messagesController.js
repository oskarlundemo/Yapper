



import {prisma} from '../prisma/index.js';

export const sendPrivateMessage = async (req, res) => {
    try {
        console.log('Skicka privat');
        const sender_id = parseInt(req.params.sender_id);
        const receiver_id = parseInt(req.params.receiver_id);

        await prisma.messages.create({
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

export const sendGroupMessage = async (req, res) => {

    try {

        const sender_id = parseInt(req.params.sender_id);
        const message = req.body.content;
        const receivers = req.body.receivers;

        console.log('Skicka grupp');
        if (receivers.length > 0) {
            const result = await prisma.$transaction(async (prisma) => {
                // Create the group chat
                const group = await prisma.groupChats.create({
                    data: {
                        admin_id: sender_id,
                    }
                });

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
                const messageRecord = await prisma.messages.create({
                    data: {
                        sender_id: sender_id,
                        receiver_id: group.id,
                        content: req.body.message,
                    }
                });
            });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json(`Error: ${err.message}`);
    }
}


export const getMessagesFromConversations = async (req, res) => {

    try {
        const sender_id = parseInt(req.params.sender_id);
        const receiver_id = parseInt(req.params.receiver_id);

        const messages = await prisma.messages.findMany({
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