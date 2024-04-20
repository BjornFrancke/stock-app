import express from "express";
import {loginUser, registerUser} from "../controllers";

const userRoutes = express.Router();

userRoutes.route('/register')
.post(registerUser)

userRoutes.route('/login')
    .post(loginUser)

export default userRoutes;