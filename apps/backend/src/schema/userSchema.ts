import {Iuser, UserModel} from "../types";
import {Schema} from "mongoose";

export const UserSchema = new Schema<Iuser, UserModel>({
    name: String,
    email: String,
    token: String,
    password: String,
    organisation: String,
})
