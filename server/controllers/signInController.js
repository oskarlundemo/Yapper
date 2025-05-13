import {prisma} from '../prisma/index.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";




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


/**
 * 1. This functions is used for logging in and assigning the user with their jwt-token, which is triggered
 *    in the Login.jsx component
 *
 * 2. The functions expect the username and password sent through the request body in the POST call
 *
 * 3. 200: Successfully logged in, return jwt-token
 *    500: Server error
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */


export const login = async (req, res) => {

    try {
        // Parse user credentials
        const {username, password} = req.body;

        // Try finding the username in the user table
        const user = await prisma.users.findUnique({
            where: {username: username},
        })

        // If the username was invalid, return error
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Username was found in the db, try matching the provided password with db using bcrypt
        const match = await bcrypt.compare(password, user.password)

        // If the password is incorrect the return error
        if (!match) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, user: user },
            process.env.JWT_SECRET,
            { expiresIn: '30min' }
        );

        console.log('Signed in');
        return res.status(200).json({ message: 'Login successful', token});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}
