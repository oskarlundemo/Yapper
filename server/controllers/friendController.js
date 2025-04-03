

import {prisma} from "../prisma/index.js";


export const addFriend = async (req, res) => {

    try {

        await prisma.$transaction([
            prisma.pendingFriendRequests.delete({
                where: {
                    sender_id_receiver_id: {
                        sender_id: parseInt(req.params.user_id),
                        receiver_id: parseInt(req.params.receiver_id)
                    }
                }
            }),

            prisma.friends.create({
                data: {
                    user_id: parseInt(req.params.user_id),
                    friend_id: parseInt(req.params.receiver_id)
                }
            }),
        ]);


    } catch (err) {
        console.error(err);
        res.status(500).send(`Error: ${err.message}`);
    }


}