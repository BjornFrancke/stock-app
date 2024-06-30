import { Schema } from "mongoose";
import { Iorder, OrderModel } from "../types";
import { ObjectId } from "mongodb";

export const orderSchema = new Schema<Iorder, OrderModel>({
    orderNumber: Number,
    items: [{_id: ObjectId, name: String, amount: Number, salesPrice: { amount: Number, vat: Number, discount: Number, currency: String }}],
    createtionDate: Date,
    dueDate: Date,
    receptian: String,
    subTotal: {
        amount: Number,
        currency: String,
        vat: Number,
        discount: Number,
        total: Number
    },
    isDone: Boolean
})



