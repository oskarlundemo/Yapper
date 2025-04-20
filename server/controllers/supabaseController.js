


import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

export { supabase };



/**
 *
 * 1. This function is used for storing thumbnails onto supabase
 *
 * 2. It is triggered in the bookReview.js router when both updating a review or creating a new one
 *
 * @param req
 * @param res
 * @returns {Promise<*|{message: string}>}
 */



export const saveAvatar = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `avatars/${req.file.originalname}`;
    const fileMimeType = req.file.mimetype;

    try {
        const { data, error } = await supabase
            .storage
            .from('yapper')
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
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


export const saveFiles = async (req, res) => {

    try {
        if (!req.files) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const files = req.files;

        for (const file of files) {

            const filePath = `files/${file.originalname}`;
            const fileMimeType = file.mimetype;

            const {data, error} = await supabase
                .storage
                .from('yapper')
                .upload(filePath, file.buffer, {
                    contentType: fileMimeType,
                    cacheControl: '3600',
                    upsert: true,
                })

            if (error) {
                console.error("Upload Error:", error.message);
                return { message: 'Error saving image' };
            }
        }

    }  catch (err) {
        console.error("Unexpected Error Uploading File:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}


export const deleteImageFromDb = async (filepath) => {
    try {
        const { data, error } = await supabase
            .storage
            .from('library')
            .remove([`books/${filepath}`]);

        if (error) {
            console.error("Error deleting image:", error.message);
            return { error: error.message };
        }

        if (!data) {
            console.log("Image not found in storage.");
            return { error: "Image not found" };
        }

        return { message: "Image deleted successfully" };
    } catch (err) {
        console.error("Unexpected error deleting image:", err);
        return { error: err.message };
    }
};






