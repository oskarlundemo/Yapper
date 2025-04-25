


import {Router} from 'express'
import multer from 'multer';
import {updateGroupAvatar, updateGroupDescription, updateGroupName} from "../controllers/groupController.js";
import {saveGroupAvatar} from "../controllers/supabaseController.js";
const upload = multer()


const groupRoute = Router();


groupRoute.post('/update/:groupId', upload.single('avatar'), updateGroupDescription, updateGroupAvatar, updateGroupName, saveGroupAvatar);



export default groupRoute;