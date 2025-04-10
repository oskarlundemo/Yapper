



import {Router} from 'express'
import {
    getAllConversations,
    getReceiverUsername, getUsersGroupConversations,
    getUsersPrivateConversations,
    searchForConversations
} from "../controllers/conversationsController.js";

const conversationRouter = Router();


conversationRouter.get('/filter/:searchquery/:user_id', searchForConversations);

conversationRouter.get('/private/:user_id', getUsersPrivateConversations);

conversationRouter.get('/receiver/username/:receiver', getReceiverUsername);

conversationRouter.get('/all/:user_id', getAllConversations);

conversationRouter.get('/group/:user_id', getUsersGroupConversations);

export default conversationRouter;