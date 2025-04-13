



import {Router} from 'express';
import {
    createGroupChat,
    getMessagesFromGroupConversation,
    getMessagesFromPrivateConversation,
    sendGroupMessage,
    sendPrivateMessage
} from "../controllers/messagesController.js";

const messagesRoute = Router();


messagesRoute.get('/private/conversation/:sender_id/:receiver_id', getMessagesFromPrivateConversation);

messagesRoute.get('/group/conversation/:sender_id/:receiver_id', getMessagesFromGroupConversation);


messagesRoute.post('/conversation/:sender_id/:receiver_id', (req, res) => {



    if (req.body.receivers.length > 1 && req.body.groupChat) {
        console.log('New groupchat with message');
        createGroupChat(req, res);
    } else if (req.body.groupChat) {
        console.log('New message in groupchat');
        sendGroupMessage(req, res);
    } else {
        console.log('New private message');
        sendPrivateMessage(req, res);
    }
});

messagesRoute.post('/group/:sender_id', sendGroupMessage);

export default messagesRoute;
