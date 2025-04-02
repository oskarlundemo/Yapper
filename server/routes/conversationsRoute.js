



import {Router} from 'express'
import {
    getReceiverUsername,
    getUserConversations,
    searchForConversations
} from "../controllers/conversationsController.js";

const conversationRouter = Router();


conversationRouter.get('/filter/:searchquery/:user_id', searchForConversations);

conversationRouter.get('/:user_id', getUserConversations);

conversationRouter.get('/receiver/username/:receiver', getReceiverUsername);

export default conversationRouter;