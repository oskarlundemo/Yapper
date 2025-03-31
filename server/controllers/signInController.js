import {prisma} from '../prisma/index.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";







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
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '30min' }
        );

        console.log('Signed in');
        // Signed in
        return res.status(200).json({ message: 'Login successful', token});
    } catch (err) {
        // Error logging in, display in UI
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}
