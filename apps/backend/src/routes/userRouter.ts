import express from "express";
import {checkIfAUserExists, getLoggedInUser, listAllUsers, loginUser, registerUser} from "../controllers";
import {firstLaunch, protect} from "../middleware/authMiddleware";

export const userRouter = express.Router();

userRouter.route('/register')
    .post(registerUser)

userRouter.route('/login')
    .post(loginUser)

userRouter.route('/me')
    .get(protect, getLoggedInUser)

userRouter.route('/users')
    .get(listAllUsers)

userRouter.route('/checkIfLoginIsPossible')
    .get(firstLaunch, checkIfAUserExists)
userRouter.route("/setup")
    .post(firstLaunch, registerUser)

