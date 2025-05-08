



import {Router} from 'express'
import {
    fetchNewPrivateMessageInfo,
    getAllConversations,
    getReceiverUsername, newGroupChat, newGroupInvite, newPendingNotification,
    searchForConversations
} from "../controllers/conversationsController.js";

const conversationRouter = Router();


conversationRouter.get('/filter/:searchquery/:user_id', searchForConversations);

conversationRouter.get('/receiver/username/:receiver', getReceiverUsername);

conversationRouter.get('/all/:user_id', getAllConversations);

conversationRouter.get('/receiver/:receiver_id', getReceiverUsername);

conversationRouter.get('/new/:sender_id/:receiver_id/:logged_in_id', newPendingNotification);

conversationRouter.get('/new/group/invite/:group_id/:logged_in', newGroupInvite)

conversationRouter.get('/new/group/chat/:group_id/:user_id', newGroupChat)

conversationRouter.get('/new/private/:message_id/:receiver_id/:sender_id/:logged_in', fetchNewPrivateMessageInfo);



export default conversationRouter;