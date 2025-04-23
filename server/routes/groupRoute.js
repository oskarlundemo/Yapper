


import {Router} from 'express'
import multer from 'multer';
import {updateGroupAvatar, updateGroupDescription} from "../controllers/groupController.js";
const upload = multer()


const groupRoute = Router();


groupRoute.post('/update/:groupId', upload.single('avatar'), updateGroupDescription, updateGroupAvatar);



export default groupRoute;