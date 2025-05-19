




import {Router} from "express";
import {login, loginGuestAccount} from "../controllers/signInController.js";

const signInRoute = new Router();

import { body, validationResult } from 'express-validator';


export const validateLogin = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .escape(),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .escape()
];

signInRoute.post('/', validateLogin, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }
    login(req, res)
})

signInRoute.post('/guest', loginGuestAccount)



export default signInRoute;