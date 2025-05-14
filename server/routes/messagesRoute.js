

import {Router} from 'express';
import multer from 'multer';
const upload = multer()
import {
    fetchNewPrivateMessage, fetchNewGroupMessage,
    createGroupChat,
    getMessagesFromGroupConversation,
    getMessagesFromPrivateConversation, sendGifGroupChat, sendGifPrivateConversation,
    sendGroupMessage,
    sendPrivateMessage,
} from "../controllers/messagesController.js";


import {body, validationResult} from 'express-validator';


export const validateMessage = [
    body('message')
        .trim()
        .escape()
]


const messagesRoute = Router();

messagesRoute.get('/private/conversation/:inspector_id/:inspected_id', getMessagesFromPrivateConversation);

messagesRoute.get('/group/conversation/:sender_id/:receiver_id', getMessagesFromGroupConversation);

messagesRoute.post('/conversation/:sender_id/:receiver_id', upload.array('files'), validateMessage, async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const receivers = JSON.parse(req.body?.receivers);
        const isGroup = req.body.groupChat === 'true';

        if (isGroup && receivers.length > 1) {
            await createGroupChat(req, res);
        } else if (isGroup) {
            await sendGroupMessage(req, res);
        } else {
            await sendPrivateMessage(req, res);
        }
    } catch (err) {
        console.error('Error handling message route:', err);
        res.status(500).json({error: 'Internal server error'});
    }
});

messagesRoute.post('/group/:sender_id', sendGroupMessage);

messagesRoute.post('/gif/:sender_id/:receiver_id', async (req, res) => {
    if (req.body.groupChat) {
        await sendGifGroupChat(req, res);
    } else {
        await sendGifPrivateConversation(req, res);
    }
});

messagesRoute.get('/new/private/:message_id', fetchNewPrivateMessage)

messagesRoute.get('/new/group/:group_id/:message_id', fetchNewGroupMessage)


export default messagesRoute;
