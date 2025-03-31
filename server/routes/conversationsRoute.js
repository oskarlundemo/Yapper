



import {Router} from 'express'
import {getConversations} from "../controllers/conversationsController.js";

const conversationRouter = Router();


conversationRouter.get('/:searchquery', getConversations);


export default conversationRouter;