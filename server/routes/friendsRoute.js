



import {Router} from 'express';
import {acceptRequest, getFriendsList} from "../controllers/friendController.js";

const friendsRouter = Router();


friendsRouter.get('/accept/request/:sender_id/:receiver_id', acceptRequest);

friendsRouter.get('/all/:user_id', getFriendsList);


export default friendsRouter;