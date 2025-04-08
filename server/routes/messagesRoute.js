



import {Router} from 'express';
import {getMessagesFromConversations, sendGroupMessage, sendPrivateMessage} from "../controllers/messagesController.js";

const messagesRoute = Router();


messagesRoute.get('/conversation/:sender_id/:receiver_id', getMessagesFromConversations);

messagesRoute.post('/conversation/:sender_id/:receiver_id', (req, res) => {
    if (req.body.receivers.length > 1) {
        sendGroupMessage(req, res);
    } else
        sendPrivateMessage(req, res);
});

messagesRoute.post('/group/:sender_id', sendGroupMessage);

export default messagesRoute;
