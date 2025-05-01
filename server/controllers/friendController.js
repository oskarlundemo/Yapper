

import {prisma} from "../prisma/index.js";


export const getFriendsList = async (req, res) => {
    try {
        const friendsList = await prisma.friends.findMany({
            where: {
                OR: [
                    { user_id: parseInt(req.params.user_id) },
                    { friend_id: parseInt(req.params.user_id) },
                ],
            },
            include: {
                User: true,
                Friend: true,
            }
        });

        const formatedFriends = await Promise.all(
            friendsList.map(async (contact) => {
                const isUser = contact.user_id === parseInt(req.params.user_id);
                const friendId = isUser ? contact.friend_id : contact.user_id;
                const friend = isUser ? contact.Friend : contact.User

                return {
                    id: friendId,
                    username: friend.username,
                    friend
                }
            })
        )
        res.status(200).json(formatedFriends);
    } catch (e) {
        console.error(e);
        res.status(500).send('Not Found');
    }
}

export const acceptRequest = async (req, res) => {
    try {

        const senderId = parseInt(req.params.sender_id);
        const receiverId = parseInt(req.params.receiver_id);

        const request = await prisma.pendingFriendRequests.findFirst({
            where: {
                OR: [
                    { sender_id: senderId, receiver_id: receiverId },
                    { sender_id: receiverId, receiver_id: senderId },
                ]
            }
        })

        if (request) {
            await prisma.$transaction([
                prisma.pendingFriendRequests.delete({
                    where: {
                        sender_id_receiver_id: {
                            receiver_id: receiverId,
                            sender_id: senderId,
                        }
                    }
                }),

                prisma.friends.create({
                    data: {
                        user_id: parseInt(req.params.sender_id),
                        friend_id: parseInt(req.params.receiver_id)
                    }
                }),
            ]);
            res.status(200).send('Successfully accepted friend');
            return;
        }
        res.status(404).send('No friend request found.');
    } catch (err) {
        console.error(err);
        res.status(500).send(`Error: ${err.message}`);
    }
}



export const checkFriendship = async (req, res) => {
    try {
        const senderId = parseInt(req.params.sender_id);
        const receiverId = parseInt(req.params.receiver_id);

        if (isNaN(senderId) || isNaN(receiverId)) {
            return res.status(400).json({ error: "Invalid sender or receiver ID." });
        }

        const friends = await prisma.friends.findFirst({
            where: {
                OR: [
                    { user_id: senderId, friend_id: receiverId },
                    { user_id: receiverId, friend_id: senderId }
                ]
            }
        });

        const isFriends = !!friends;

        res.status(200).json(isFriends);
    } catch (err) {
        console.error("Error checking friendship:", err);
        res.status(500).json({ error: "Server error" });
    }
};
