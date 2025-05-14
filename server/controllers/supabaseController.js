


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



export const saveAvatar = async (req, res) => {
    if (!req.file) {  // If there is no file, return
        return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `avatars/${req.file.originalname}`; // Parse the path
    const fileMimeType = req.file.mimetype; // Parse the type

    try {
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
            return { message: 'Error saving image' };
        }

        return { message: 'Thumbnail saved successfully' };
    } catch (err) {
        console.error("Unexpected Error Uploading File:", err);
        return res.status(500).json({ error: "Internal server error while uploading file" });
    }
};


/**
 * 1. This function is used for updating the avatar of a group chat. Which is triggered in the
 *    updateGroupAvatar function in the groupController.js
 *
 * 2. It only expects that the file itself is passed down through multer in the request parameter
 *
 * 3. 500: Server error, log it and display
 *    400: No files uploaded
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*|{message: string}>}
 */

export const saveGroupAvatar = async (req, res, next) => {

    if (!req.file) { // If there is no file, return
        return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `groupavatars/${req.file.originalname}`; // Parse the path
    const fileMimeType = req.file.mimetype; // Parse the type

    try {
        const {data, error} = await supabase
            .storage
            .from('yapper') // To bucket
            .upload(filePath, req.file.buffer, {
                contentType: fileMimeType,
                cacheControl: '3600',
                upsert: true,
            });

        if (error) {
            console.error("Upload Error:", error.message);
        }

        next()
        return { message: 'Group avatar successfully updated' };

    } catch (err) {
        console.error("Unexpected Error Uploading File:", err);
        return res.status(500).json({ error: "Internal server error while uploading file" });
    }

}


/**
 *
 *
 *
 *
 *
 *
 *
 */


export const saveFilesFromConversations = async (req) => {
    if (!req.files || req.files.length === 0) return;

    const folderSelector = req.body.group ? 'groupConversations' : 'privateConversations';

    // Process each file
    for (const file of req.files) {
        const uniqueFileName = `${uuidv4()}-${slugify(file.originalname, { lower: true, strict: true })}`;
        const filePath = `${folderSelector}/${uniqueFileName}`;

        // Upload file to Supabase storage
        const { error } = await supabase.storage.from('yapper').upload(filePath, file.buffer, {
            contentType: file.mimetype,
            cacheControl: '3600',
            upsert: true,
        });

        if (error) {
            console.error("Upload Error:", error.message);
            throw new Error('Error saving file to storage');
        }

        const baseData = {
            message_id: req.messageID,
            path: filePath,
            originalName: file.originalname,
            uniqueFileName: uniqueFileName,
            size: file.size,
        };

        // Save attachments to the database
        if (req.body.group) {
            await prisma.groupMessagesAttachment.create({ data: baseData });
        } else {
            await prisma.privateMessagesAttachment.create({ data: baseData });
        }
    }
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
 * @param res
 * @returns {Promise<*|{message: string}>}
 */


export const saveFiles = async (req, res) => {

    try {
        if (!req.files) { // If there are no files, return
            return res.status(400).json({ message: "No file uploaded" });
        }

        const files = req.files; // Get files

        for (const file of files) { // Upload each file

            const filePath = `files/${file.originalname}`;  // Destination
            const fileMimeType = file.mimetype; // Type

            const {data, error} = await supabase
                .storage
                .from('yapper') // To bucket
                .upload(filePath, file.buffer, {
                    contentType: fileMimeType,
                    cacheControl: '3600',
                    upsert: true,
                })

            if (error) {
                console.error("Upload Error:", error.message);
                return { message: 'Error saving file' };
            }
        }
    }  catch (err) {
        console.error("Unexpected Error Uploading File:", err);
        return res.status(500).json({ error: "Internal server error while uploading file" });
    }
}






