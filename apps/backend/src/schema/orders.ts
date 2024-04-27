import { Schema } from "mongoose";
import { Iorder, OrderModel } from "../types";
import { ObjectId } from "mongodb";

export const orderSchema = new Schema<Iorder, OrderModel>({
    orderNumber: Number,
    items: [{_id: ObjectId, name: String, amount: Number, salesPrice: { amount: Number, currency: String }}],
    createtionDate: Date,
    dueDate: Date,
    receptian: String,
    isDone: Boolean
})



