import {prisma} from '../prisma/index.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";




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
        res.status(500).send({error: e});
    }
}

