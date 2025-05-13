



import {Router} from 'express';
import {blockUser, getListOfBlockedUsers, userGettingUnblocked, unblockUser} from "../controllers/blockController.js";


export const blockRoute = Router();


blockRoute.post("/:blocking_user/:blocked_user", blockUser)

blockRoute.delete('/unblock/:unblocking_user/:unblocked_user', unblockUser)

blockRoute.post('/remove/:unblocking_user/:unblocked_user/:logged_in', userGettingUnblocked)

blockRoute.get("/list/:user_id", getListOfBlockedUsers)