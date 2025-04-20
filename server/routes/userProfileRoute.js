

import multer from "multer";
import {Router} from "express";
import {deleteImageFromDb, saveAvatar} from "../controllers/supabaseController.js";

const userProfileRouter = Router();
const upload = multer()


userProfileRouter.post('/avatar/upload', upload.single('avatar'), async (req, res, next) => {
    await saveAvatar(req, res)
})

userProfileRouter.delete('/avatar/delete', async (req, res, next) => {
    await deleteImageFromDb(req, res)
})