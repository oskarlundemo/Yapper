



import {Router} from 'express';
import {acceptRequest, getFriendsList, checkFriendship} from "../controllers/friendController.js";

const friendsRouter = Router();


friendsRouter.get('/accept/request/:sender_id/:receiver_id', acceptRequest);

friendsRouter.get('/all/:user_id', getFriendsList);

friendsRouter.get('/check/:receiver_id/:sender_id', checkFriendship)


export default friendsRouter;