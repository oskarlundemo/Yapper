


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
                                created_at: 'asc',
                            },
                            take: 1
                        }
                    }
                }
            }
        })
        console.log(friendRequests);
        res.status(200).json(friendRequests);

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


export const checkFriendship = async (req, res) => {
    try {

        console.log('Checking friendship...');
        console.log(req.params)
        const friends = await prisma.friends.findFirst({
            where: {
                OR: [
                    { user_id: parseInt(req.params.sender_id), friend_id: parseInt(req.params.receiver_id) },
                    { user_id: parseInt(req.params.receiver_id), friend_id: parseInt(req.params.sender_id) }
                ]
            }
        })

        res.status(200).json(friends);
    } catch (err) {
        console.error(err);
        res.status(500).json(`Error: ${err}`);
    }
}