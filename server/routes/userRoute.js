


import {Router} from 'express';
import {retrieveUsers, updateUserBio, updateUserProfile} from "../controllers/usersController.js";
import multer from 'multer';
const upload = multer()



const userRoute = Router();


userRoute.get('/:user_id/filter', retrieveUsers)

userRoute.post('/update/profile/:user_id/', upload.single('avatar'), updateUserProfile)

export default userRoute;