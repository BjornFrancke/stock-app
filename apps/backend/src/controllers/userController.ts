import jwt from 'jsonwebtoken';
import 'dotenv/config'
import asyncHandler from "express-async-handler";
import {User} from "../models";
import bcrypt from "bcryptjs";
import {ExtendedRequest} from "../types"

export const jtwSecret = process.env.JWT_SECRET_KEY || "secret"


const generateToken = (id: string | object | undefined) => {
    return jwt.sign({ id }, jtwSecret, { expiresIn: '30d' });
}

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body


    if (!name || !email || !password) {
        console.log(req.body)
        res.status(400).send("Please enter a valid email and password");
        return
    }

    const userExists = await User.findOne({ email: email });
    if (userExists) {
        res.status(400).send("User already exists");
        return
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if (newUser) {
        res.status(201).json({
            _id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            token: generateToken(newUser._id)
        })
    } else {
        res.status(400).send("invalid user data");
    }
})

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send("Please enter a valid email and password")
      return
    }

    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(401).send("Invalid email or password")
    }

})

export const getLoggedInUser = asyncHandler(async (req: ExtendedRequest, res) => {
    const userData = await User.findById(req.user?._id)
    if (!userData) {
        res.status(404).send("User not found");
        return;
    }
    const {_id, name, email} = userData;
    res.status(200).json({
        id: _id,
        name,
        email

    })

})
