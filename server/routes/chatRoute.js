


import {Router} from 'express';
import {getUsername} from "../controllers/chatController.js";


const chatRouter = Router();

chatRouter.get('/:user_id', getUsername)


export default chatRouter;