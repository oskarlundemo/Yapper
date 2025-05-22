
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import terminalLink from 'terminal-link';
import signUpRoute from './routes/signUpRoute.js';
import signInRoute from './routes/signInRoute.js'
import conversationsRoute from './routes/conversationsRoute.js';
import friendsRoute from './routes/friendsRoute.js';
import messagesRoute from './routes/messagesRoute.js';
import userRoute from './routes/userRoute.js';
import groupRoute from './routes/groupRoute.js';
import {blockRoute} from "./routes/blockRoute.js";
import { fileURLToPath } from 'url';

import cors from 'cors';
import path from 'path';

const PORT = process.env.PORT || 5001;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reactBuildPath = path.join(__dirname, "../client/dist");

const corsOptions = {
    origin: 'https://yapper-a7f7.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(express.static(reactBuildPath));
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/sign-in', signInRoute);
app.use('/sign-up', signUpRoute);
app.use('/conversations', conversationsRoute);
app.use('/friends', friendsRoute);
app.use('/messages', messagesRoute);
app.use('/users', userRoute);
app.use('/groups', groupRoute);
app.use('/blocks', blockRoute);



// Handle React routes
app.get('*', (req, res) => {
    res.sendFile(path.join(reactBuildPath, "index.html"), (err) => {
        if (err) {
            console.error("Error serving index.html:", err);
            res.status(500).send(err);
        }
    });
});



app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    const link = terminalLink(url);
    console.log(`Server running on port ${PORT}`);
    console.log(`Access your application at: ${link}`);
});




