import { Schema } from "mongoose";
import { Iorder, OrderModel } from "../types";
import { ObjectId } from "mongodb";

export const orderSchema = new Schema<Iorder, OrderModel>({
    orderNumber: Number,
    items: [{_id: ObjectId, amount: Number}],
    createtionDate: Date,
    dueDate: Date,
    receptian: String,
    isDone: Boolean
})



