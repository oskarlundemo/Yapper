import {prisma} from "../prisma/index.js";


export const updateGroupDescription = async(req,res, next) => {

    try {
        if (!req.body.description)
            return;
        await prisma.groupChats.update({
            where: {
                id: parseInt(req.params.groupId),
            },
            data: {
                description: req.body.description,
            }
        })

        next();

    } catch (err) {
        console.log(err)
        res.status(500).json(`Error: ${err.message}`);
    }
}


export const updateGroupName = async(req,res, next) => {

    try {
        if (!req.body.groupName)
            return;

        const groupName = req.body.groupName;

        await prisma.groupChats.update({
            where: {
                id: parseInt(req.params.groupId),
            },
            data: {
                name: groupName,
            }
        })
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