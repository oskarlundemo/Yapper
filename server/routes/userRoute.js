


import {Router} from 'express';
import {
    getUserProfileInfo,
    retrieveUsers,
    sendProfileUpdateResponse,
    updateUserAvatar,
    updateUserBio
} from "../controllers/usersController.js";
import multer from 'multer';
const upload = multer()



const userRoute = Router();


userRoute.get('/:user_id/filter', retrieveUsers)

userRoute.get('/:user_id/profile/info', getUserProfileInfo)

userRoute.post('/update/profile/:user_id/', upload.single('avatar'), updateUserBio, updateUserAvatar, sendProfileUpdateResponse)

export default userRoute;