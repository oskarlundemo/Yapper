


import {Router} from 'express'
import multer from 'multer';
import {
    addUserToGroup, deleteGroupChat, fetchNewGroupMessage, leaveGroupChat,
    removeUserFromGroup,
    updateGroupAvatar,
    updateGroupDescription,
    updateGroupName
} from "../controllers/groupController.js";
const upload = multer()


const groupRoute = Router();


groupRoute.post('/update/:groupId', upload.single('avatar'), updateGroupDescription, updateGroupAvatar, updateGroupName);

groupRoute.delete('/remove/:groupMemberId/:groupId', removeUserFromGroup)

groupRoute.post('/add/:newUserId/:groupId', addUserToGroup)

groupRoute.get('/new/message/:message_id', fetchNewGroupMessage)

groupRoute.delete('/leave/:groupMemberId/:groupId', leaveGroupChat)

groupRoute.delete('/delete/:groupId', deleteGroupChat)


export default groupRoute;