



import {Router} from 'express'
import {
    checkForAttachedFiles,
    getAllConversations,
    getReceiverUsername, newGroupChat, newPendingNotification,
    searchForConversations
} from "../controllers/conversationsController.js";

const conversationRouter = Router();


conversationRouter.get('/filter/:searchquery/:user_id', searchForConversations);

conversationRouter.get('/receiver/username/:receiver', getReceiverUsername);

conversationRouter.get('/all/:user_id', getAllConversations);

conversationRouter.get('/receiver/:receiver_id', getReceiverUsername);

conversationRouter.get('/new/:sender_id/:receiver_id/:logged_in_id', newPendingNotification);

conversationRouter.get('/new/group/:group_id', newGroupChat)

conversationRouter.get('/new/private/:message_id', checkForAttachedFiles);



export default conversationRouter;