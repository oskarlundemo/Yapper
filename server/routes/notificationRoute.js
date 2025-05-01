


import {Router} from 'express';
import {
    loadFriendRequests, loadGroupRequests,
    sendFriendRequest
} from "../controllers/notificationController.js";


const notificationRoute = Router();


notificationRoute.get('/friend/requests/:user_id', loadFriendRequests)

notificationRoute.get('/group/requests/:user_id', loadGroupRequests)

notificationRoute.post('/friends/:receiver_id/:user_id', sendFriendRequest)

export default notificationRoute;