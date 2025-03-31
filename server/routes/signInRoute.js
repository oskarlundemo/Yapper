




import {Router} from "express";
import {login} from "../controllers/signInController.js";

const signInRoute = new Router();

import { body, validationResult } from 'express-validator';


export const validateLogin = [
    // Validate username (ensure it's not empty)
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .escape(),

    // Validate password (ensure it's not empty)
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .escape()
];

signInRoute.post('/', validateLogin, (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ errors: errors.array()});
    }
    login(req, res)
})


export default signInRoute;