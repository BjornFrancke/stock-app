import express from "express";
import {getLoggedInUser, loginUser, registerUser} from "../controllers";
import {protect} from "../middleware/authMiddleware";

const userRoutes = express.Router();

userRoutes.route('/register')
.post(registerUser)

userRoutes.route('/login')
    .post(loginUser)

userRoutes.route('/me')
    .get(protect, getLoggedInUser)

export default userRoutes;
