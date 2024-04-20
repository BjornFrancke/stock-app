import {Iuser, UserModel} from "../types";
import {model} from "mongoose";
import {UserSchema} from "../schema/userSchema";

export const User: UserModel = model<Iuser, UserModel>("User", UserSchema)