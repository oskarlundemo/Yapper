


import {Router} from 'express';
import {retrieveUsers} from "../controllers/usersController.js";
import multer from 'multer';
const upload = multer()



const userRoute = Router();


userRoute.get('/:user_id/filter', retrieveUsers)

userRoute.post('/update/profile/:user_id/', upload.single('avatar'), (req, res) => {
    console.log(req.file)
    console.log(req.body.bio)
})

export default userRoute;