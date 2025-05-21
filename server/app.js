
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

const PORT = process.env.PORT || 5001;
const app = express();

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


app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    const link = terminalLink(url);
    console.log(`Server running on port ${PORT}`);
    console.log(`Access your application at: ${link}`);
});


