


import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import {v4 as uuidv4} from 'uuid';
import slugify from 'slugify';
import {prisma} from "../prisma/index.js";




/**
 * 1. What does this function do, where is it called?
 * (→ Describe the function’s purpose and trigger point in the app.)
 * e.g., “This function fetches all posts for a specific user. It is triggered when the client navigates to the user's profile page.”
 *
 * 2. What data and method does it expect, and what does it return?
 * (→ Summarize the key input(s) from the frontend or route params and what data is sent back.)
 * e.g., “It expects a userId in the request parameters. It returns an array of posts with related user and comment data.”
 *
 * 3. List the success and error responses. Example:
 *  * 201: User was successfully banned.
 *  * 400: An error occurred (e.g., invalid user ID or database issue).
 * @returns {Promise<void>}
 */


const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

export { supabase };



/**
 *
 * 1. This function is used for deleting old avatars from group and user pictures on Supabase, triggered
 *    in the updateUserAvatar and updateGroupAvatar functions in usersController.js respectively groupController
 *
 * 2. It expects that the path to the old avatar is sent through the parameter, since it that we are deleting
 *
 * @param req
 * @param res
 * @returns {Promise<*|{message: string}>}
 */




export const deleteOldAvatar = async (req, res, oldAvatar) => {

    // No old avatar? Return
    if (!oldAvatar) {
        return;
    }

    const folderSelector = req.body.groupChat === 'true' ? 'groupAvatars' : 'userAvatars'; // Is it a group avatar or user avatar
    const filePath = `${folderSelector}/${oldAvatar}`; // Path to the old file in Supabase


    const { data, error } = await supabase
        .storage
        .from('yapper')
        .remove([filePath]); // Delete at this path

    if (error) {
        console.error("Delete Error:", error.message); // If any errors, display then
        return { message: 'Error deleting avatar' };
    }

    return { message: 'Successfully deleted old avatar' };
};

/**
 *
 * 1. This function is used for storing avatars / profile pictures onto Supabase, triggered
 *    in the updateUserAvatar function in the usersController.js
 *
 * 2. It only expects that the file itself is passed down through multer in the request parameter
 *
 * 3. 500: Server error, log it and display
 *
 * @param req
 * @param res
 * @returns {Promise<*|{message: string}>}
 */



export const saveNewAvatar = async (req, res) => {

    if (!req.file) {  // If there is no file, return
        return {message: 'No file uploaded.'};
    }

    const uniqueFileName = `${uuidv4()}-${slugify(req.file.originalname, { lower: true, strict: true })}`;
    const folderSelector = req.body.groupChat === 'true' ? 'groupAvatars' : 'userAvatars';

    const filePath = `${folderSelector}/${uniqueFileName}`; // Parse the path
    const fileMimeType = req.file.mimetype; // Parse the type

    const { data, error } = await supabase
        .storage
        .from('yapper') // Update to bucket yapper
        .upload(filePath, req.file.buffer, {
            contentType: fileMimeType,
            cacheControl: '3600',
            upsert: true,
        });

    if (error) {
        console.error("Upload Error:", error.message);
        return { message: 'Error saving avatar' };
    }

    return uniqueFileName;
};



/**
 * 1. This function is used for saving files into Supabase once a user sends them in a chat.
 *    So they can be stored and downloaded by other users. It is triggered in the sendPrivateMessage
 *    and sendGroupMessage functions inside the messagesController.js
 *
 * 2. It only expects the files to be passed through with multer via the request parameter
 *
 * 3. 500: Server error, log it and display
 *    400: No files uploaded
 *
 * @param req
 * @param messageId
 * @returns {Promise<*|{message: string}>}
 */


export const saveFilesFromConversations = async (req, messageId) => {
    if (!req.files || req.files.length === 0) return [];

    const isGroupChat = req.body.groupChat === 'true';

    const folderSelector = isGroupChat ? 'groupConversations' : 'privateConversations';
    const fileEntries = [];

    for (const file of req.files) {
        const uniqueFileName = `${uuidv4()}-${slugify(file.originalname, { lower: true, strict: true })}`;
        const filePath = `${folderSelector}/${uniqueFileName}`;

        const { error } = await supabase.storage.from('yapper').upload(filePath, file.buffer, {
            contentType: file.mimetype,
            cacheControl: '3600',
            upsert: true,
        });

        if (error) {
            console.error("Upload Error:", error.message);
            throw new Error('Error saving file to storage');
        }

        fileEntries.push({
            message_id: messageId,
            path: filePath,
            originalName: file.originalname,
            uniqueFileName: uniqueFileName,
            size: file.size,
        });
    }

    return fileEntries;
};










