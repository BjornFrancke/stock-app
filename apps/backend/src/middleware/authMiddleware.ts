import jwt, {JwtPayload} from 'jsonwebtoken';
import asyncHandler from "express-async-handler";
import {User} from "../models/userModel";
import {Request, Response, NextFunction} from 'express';
import {ExtendedRequest, Iuser} from "../types";

const jtwSecret = process.env.JWT_SECRET_KEY || "secret"

export const protect = asyncHandler(async (req: ExtendedRequest, res : Response, next: NextFunction) => {
    let token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) try {
        token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, jtwSecret) as JwtPayload;

        req.user = (await User.findById(decoded.id).select("-password")) as Iuser;

        next()
    } catch (error){
        console.log(error);
        res.status(401);
        return
    }

    if (!token) {
        res.status(401).send("Not authenticated");
    }

})
