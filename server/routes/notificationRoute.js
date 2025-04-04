


import {Router} from 'express';
import {
    checkFriendship,
    loadFriendRequests,
    sendFriendRequest
} from "../controllers/notificationController.js";


const notificationRoute = Router();


notificationRoute.get('/friend/requests/:user_id', loadFriendRequests)

notificationRoute.get('/friends/:receiver_id/:sender_id', checkFriendship)

notificationRoute.post('/friends/:receiver_id/:user_id', sendFriendRequest)

export default notificationRoute;