import express from "express";
import {registerUser} from "../controllers";

const userRoutes = express.Router();

userRoutes.route('/register')
.post(registerUser)

export default userRoutes;