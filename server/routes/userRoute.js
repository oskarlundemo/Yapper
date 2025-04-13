


import {Router} from 'express';
import {retrieveUsers} from "../controllers/usersController.js";

const userRoute = Router();


userRoute.get('/:user_id/filter', retrieveUsers)

export default userRoute;