


import {prisma} from "../prisma/index.js";


export const loadFriendRequests = async (req, res) => {
    try {
        const friendRequests = await prisma.pendingFriendRequests.findMany({
            where: {
                receiver_id: parseInt(req.params.user_id)
            },
            include: {
                Sender: {
                    include: {
                        messagesSent: {
                            where: {
                                receiver_id: parseInt(req.params.user_id)
                            },
                            orderBy: {
                                created_at: 'desc'
                            },
                            take: 1
                        }
                    }
                }
            }
        });
        res.status(200).json(friendRequests);

    } catch (err) {
        console.error(err);
        res.status(500).json(`Error: ${err}`);
    }
}


export const loadGroupRequests = async (req, res) => {

    try {
        const groupRequests = await prisma.pendingGroupRequest.findMany({
            where: {
                receiver_id: parseInt(req.params.user_id)
            },
            include: {
                Group: {
                    include: {
                        GroupMessages: {
                            include: {
                                sender: true
                            },
                            orderBy: {
                                created_at: 'asc'
                            },
                            take: 1
                        }
                    }
                },
                Receiver: true
            },
        })
        res.status(200).json(groupRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json(`Error: ${err}`);
    }
}



export const sendFriendRequest = async (req, res) => {
    try {
        const existingRequest = await prisma.pendingFriendRequests.findFirst({
            where: {
                OR: [
                    { sender_id: parseInt(req.params.user_id), receiver_id: parseInt(req.params.receiver_id) },
                    { sender_id: parseInt(req.params.receiver_id), receiver_id: parseInt(req.params.user_id) }
                ]
            }
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already sent." });
        }

        await prisma.pendingFriendRequests.create({
            data: {
                sender_id: parseInt(req.params.user_id),
                receiver_id: parseInt(req.params.receiver_id)
            }
        });

        console.log(`Friend request sent to ${req.params.receiver_id}`);
        res.status(200).json({ message: "Friend request sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}
