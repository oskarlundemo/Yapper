



import {Router} from 'express';
import {acceptRequest} from "../controllers/friendController.js";

const friendsRouter = Router();


friendsRouter.get('/accept/request/:sender_id/:receiver_id', acceptRequest);


export default friendsRouter;