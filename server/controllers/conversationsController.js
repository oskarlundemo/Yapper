

import {prisma} from '../prisma/index.js';


export const searchForConversations = async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            where: {
                username: {
                    contains: req.params.searchquery,
                    mode: "insensitive"
                },
                id: {not: parseInt(req.params.user_id)}
            }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json(`Error: ${error}`);
    }
}


export const getReceiverUsername = async (req, res) => {
    try {
        console.log('Receiver username');
        console.log(req.params);
        const username = await prisma.users.findUnique({
            where: {
                id: parseInt(req.params.receiver)
            }
        })
        res.status(200).json(username);
    } catch (err) {
        console.error(err);
        res.status(500).json(`Error: ${err}`);
    }
}



export const getUserConversations = async (req, res) => {
    try {
        const conversations = await prisma.users.findMany({
            where: {
                id: {not: parseInt(req.params.user_id)}
            }
        })
        res.status(200).json(conversations);
    } catch (err) {
        console.error(err);
        res.status(500).json(`Error: ${err}`);
    }
}

