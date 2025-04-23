import {prisma} from "../prisma/index.js";


export const updateGroupDescription = async(req,res) => {

    try {
        if (!req.body.description)
            return res.status(400).send('Bio not found');

        await prisma.groupChats.update({
            where: {
                id: parseInt(req.params.groupId),
            },
            data: {
                description: req.body.description,
            }
        })

    } catch (err) {
        console.log(err)
        res.status(500).json(`Error: ${err.message}`);
    }
}

export const updateGroupAvatar = async(req,res) => {
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

        }
    } catch (err) {
        console.log(err)
        res.status(500).json(`Error: ${err.message}`);
    }
}