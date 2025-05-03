import {prisma} from "../prisma/index.js";

export const getListOfBlockedUsers = async (req, res) => {
    try {
        const listOfBlockedUsers = await prisma.blocks.findMany({
            where: {
                blocker: parseInt(req.params.user_id)
            },
            include: {
                BlockedUser: true
            }
        });
        res.status(200).json(listOfBlockedUsers);
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'Server Error': err.message });
    }
};


export const unblockUser = async (req, res) => {

    try {

        // Oskar 1
        // Axa 2

        const unblockingUser = parseInt(req.params.unblocking_user); // 1
        const unblockedUser = parseInt(req.params.unblocked_user); // 2
        const loggedInUser = parseInt(req.params.user_id); // 2


        // 2 ? 2 : 1 = 2
        const updatedList = loggedInUser ? unblockedUser : unblockingUser;

        const block = await prisma.blocks.delete({
            where: {
                blocked_blocker: {
                    blocker: unblockingUser,
                    blocked: unblockedUser
                }
            }
        })


        if (block.friends) {
            await prisma.friends.create({
                data: {
                    user_id: unblockingUser,
                    friend_id: unblockedUser,
                },
            })
        }

        //
        const updateBlockList = await prisma.blocks.findMany({
            where: {
                blocker: updatedList,
            },
            include: {
                BlockedUser: true
            },
        })

        console.log(updateBlockList);

        res.status(200).json(updateBlockList);
    } catch (err) {
        res.status(500).json({ 'Server Error': err.message });
    }
}



export const blockUser = async (req, res) => {
    try {

        const blocker = parseInt(req.params.blocking_user);
        const blocked = parseInt(req.params.blocked_user)

        const checkFriendShip = await prisma.friends.findFirst({
            where: {
                OR: [
                    { friend_id: blocked, user_id: blocker },
                    { friend_id: blocker, user_id: blocked },
                ]
            }
        })

        const friends = !!checkFriendShip;

        await prisma.blocks.create({
            data: {
                blocker: blocker,
                blocked: blocked,
                friends: friends
            }
        })

        if (friends) {
            await prisma.friends.deleteMany({
                where: {
                    OR: [
                        { friend_id: blocked, user_id: blocker },
                        { friend_id: blocker, user_id: blocked }
                    ]
                }
            });
        }

        const updatedList = await prisma.blocks.findMany({
            where: {
                blocker: blocker
            },
            include: {
                BlockedUser: true
            }
        })

        res.status(200).json(updatedList);
    } catch (err) {
        console.error(err);
        res.status(500).json({'Server Error': err.message});
    }
}



export const unblockOldUser = async (req, res) => {


    try {

        const blocker = parseInt(req.params.unblocking_user)
        const blocked = parseInt(req.params.unblocked_user)
        const loggedIn = parseInt(req.params.logged_in)
        const respondUser = loggedIn === blocker ? blocked : blocker;

        const latestMessage = await prisma.privateMessages.findFirst({
            where: {
                OR: [
                    { sender_id: blocker, receiver_id: blocked },
                    { sender_id: blocked, receiver_id: blocker }
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

        const user = await prisma.users.findUnique({
            where: {
                id: respondUser,
            }
        })

        const formattedResponse = {
            user: user,
            latestMessage: latestMessage,
        }

        res.status(200).json(formattedResponse);

    } catch (err) {
        console.error(err);
        res.status(500).json({'Server Error': err.message});
    }
}





