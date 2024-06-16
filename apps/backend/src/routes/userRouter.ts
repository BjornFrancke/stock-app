import express from "express";
import {getLoggedInUser, listAllUsers, loginUser, registerUser} from "../controllers";
import {protect} from "../middleware/authMiddleware";

export const userRouter = express.Router();

userRouter.route('/register')
    .post(registerUser)

userRouter.route('/login')
    .post(loginUser)

userRouter.route('/me')
    .get(protect, getLoggedInUser)

userRouter.route('/users')
    .get(listAllUsers)

