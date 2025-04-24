


import {Router} from 'express'
import multer from 'multer';
import {updateGroupAvatar, updateGroupDescription} from "../controllers/groupController.js";
import {saveGroupAvatar} from "../controllers/supabaseController.js";
const upload = multer()


const groupRoute = Router();


groupRoute.post('/update/:groupId', upload.single('avatar'), updateGroupDescription, updateGroupAvatar, saveGroupAvatar);



export default groupRoute;