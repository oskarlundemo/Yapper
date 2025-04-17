



import {Router} from 'express'
import {
    getAllConversations,
    getReceiverUsername,
    searchForConversations
} from "../controllers/conversationsController.js";

const conversationRouter = Router();


conversationRouter.get('/filter/:searchquery/:user_id', searchForConversations);

conversationRouter.get('/receiver/username/:receiver', getReceiverUsername);

conversationRouter.get('/all/:user_id', getAllConversations);


export default conversationRouter;