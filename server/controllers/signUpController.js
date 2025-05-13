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
 * 1. This function is used as middleware in the signUpRoute to check that the username is unique
 *
 * 2. It only expects the username to sent in as a paramter
 *
 * 3. Returns true if unique, else false
 *
 * @param username
 * @returns {Promise<boolean>}
 */



export async function uniqueUsername(username) {
    try {

        // Does the parameter username exist in the user table
        const existingUsername = await prisma.users.findUnique({
            where: {username: username,}
        })

        // If the username already exists the send the error 'Already registered'
        if (existingUsername) {
            throw new Error(`Username already registered`)
        }

        // Not found so proceed with
        return true;

    } catch (err) {
        console.error(err);
        throw err;
    }
}


/**
 * 1. This function take a email as @param and checks either or not the mail is already registered in the db.
 *  This is a helper function to the createUser function
 *
 * 2. The functions require a string (email) as a parameter
 *
 * 3. Return true if the email does not exist else throw a new error displayed in the front-end
 */

export async function uniqueEmail (email) {
    try {
        // Check if the email already exists in the user table
        const existingEmail = await prisma.users.findUnique({
            where: {email: email,}
        })

        // If it already exists, throw an error displayed in the front-end
        if (existingEmail) {
            throw new Error(`Email already registered`)
        }

        // Email is not registered in the system. proceed
        return true;
    } catch (err) {
        // Error with request to db
        console.error(err);
        throw err;
    }
}




/**
 * 1. This functions is used for signing up users and assigning them with a jwt-token once they pass the
 *    other middleware in the sing-up route
 *
 * 2. It expects the password, email and username sent through the request body, triggered in the
 *    CreateUserBox.jsx component by the POST-request
 *
 * 3. 201: Successfully signed up, return the jwt-token
 *    500: Server error, log it
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */


export const signUpUser = async(req, res) => {
    try {
        const { username, password, email} = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const user  = await prisma.users.create({
            data: {
                username: username,
                password: hashedPassword,
                email: email,
            }
        });

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '30min' }
        );

        res.status(201).json({ message: "Successfully registered", token});

    } catch (e) {
        console.error(`Error while signing up user: ${e}`);
        res.status(500).send({error: 'Error while signing up'});
    }
}

