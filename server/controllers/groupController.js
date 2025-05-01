import {prisma} from "../prisma/index.js";


export const updateGroupDescription = async(req,res, next) => {
    try {
        if (req.body.description) {
            await prisma.groupChats.update({
                where: {
                    id: parseInt(req.params.groupId),
                },
                data: {
                    description: req.body.description,
                }
            })
        }

        next();

    } catch (err) {
        console.log(err)
        res.status(500).json(`Error: ${err.message}`);
    }
}


export const leaveGroupChat = async(req,res) => {

    try {
        await prisma.groupMembers.delete({
            where: {
                member_id_group_id: {
                    group_id: parseInt(req.params.groupId),
                    member_id: parseInt(req.params.groupMemberId)
                }
            }
        })
        res.status(200).json(`User left the group chat`);
    } catch (err) {
        res.status(500).json(`Error: ${err.message}`);
    }
}



export const deleteGroupChat = async(req,res) => {

    try {
        await prisma.groupChats.delete({
            where: {
                id: parseInt(req.params.groupId),
            }
        })
        res.status(201).json('Group deleted successfully');
    } catch (err) {
        res.status(500).json(`Error: ${err.message}`);
    }
}


export const addUserToGroup = async(req,res) => {

    try {


        const alreadyInGroup = await prisma.groupMembers.findFirst({
            where: {
                group_id: parseInt(req.params.groupId),
                member_id: parseInt(req.params.newUserId)
            }
        })

        if (!alreadyInGroup) {
            await prisma.groupMembers.create({
                data: {
                    group_id: parseInt(req.params.groupId),
                    member_id: parseInt(req.params.newUserId)
                }
            })

            const updatedUsers = await prisma.groupChats.findUnique({
                where: {
                    id: parseInt(req.params.groupId),
                },
                include: {
                    GroupMembers: {
                        include: {
                            Member: true
                        }
                    }
                }
            })
            res.status(200).json(updatedUsers);
        }

    } catch (err) {
        res.status(500).json(`Error: ${err.message}`);
    }
}


export const removeUserFromGroup = async(req,res) => {
    try {
        await prisma.groupMembers.delete({
            where: {
                member_id_group_id: {
                    group_id: parseInt(req.params.groupId),
                    member_id: parseInt(req.params.groupMemberId)
                }
            }
        })

        const remainingUsers = await prisma.groupChats.findUnique({
            where: {
                id: parseInt(req.params.groupId),
            },
            include: {
                GroupMembers: {
                    include: {
                        Member: true
                    }
                }
            }
        })

        res.status(200).json(remainingUsers);
    } catch (err) {
        console.log(err)
        res.status(500).json(`Error: ${err.message}`);
    }
}




export const updateGroupName = async(req,res, next) => {
    try {
        if (req.body.groupName) {
            const groupName = req.body.groupName;

            await prisma.groupChats.update({
                where: {
                    id: parseInt(req.params.groupId),
                },
                data: {
                    name: groupName,
                }
            })
        }

        next();
    } catch (err) {
        console.log(err)
        res.status(500).json(`Error: ${err.message}`);
    }
}

export const updateGroupAvatar = async (req,res, next) => {
    try {
        if (req.file) {
            await prisma.groupChats.update({
                data: {
                    avatar: req.file.originalname,
                },
                where: {
                    id: parseInt(req.params.groupId),
                }
            })
            res.status(200).json({message: "Group updated successfully"});
        }
        next();
    } catch (err) {
        console.log(err)
        res.status(500).json(`Error: ${err.message}`);
    }
}