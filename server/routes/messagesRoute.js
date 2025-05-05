

import {Router} from 'express';
import multer from 'multer';
const upload = multer()
import {
    checkFiles, checkGroupFiles,
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
        .notEmpty()
        .escape()
]


const messagesRoute = Router();

messagesRoute.get('/private/conversation/:sender_id/:receiver_id', getMessagesFromPrivateConversation);

messagesRoute.get('/group/conversation/:sender_id/:receiver_id', getMessagesFromGroupConversation);

messagesRoute.post('/conversation/:sender_id/:receiver_id', upload.array('files'), validateMessage, (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ errors: errors.array()});
    }

    const receivers = JSON.parse(req.body?.receivers);
    if (receivers.length > 1 && req.body.groupChat === 'true') {
        createGroupChat(req, res);
    } else if (req.body.groupChat === 'true')  {
        sendGroupMessage(req, res);
    } else {
        sendPrivateMessage(req, res);
    }
});

messagesRoute.post('/group/:sender_id', sendGroupMessage);

messagesRoute.post('/gif/:sender_id/:receiver_id', (req, res) => {
    if (req.body.groupChat) {
        sendGifGroupChat(req, res);
    } else {
        sendGifPrivateConversation(req, res);
    }
});

messagesRoute.get('/files/:message_id', checkFiles)

messagesRoute.get('/files/group/:message_id', checkGroupFiles)


export default messagesRoute;
