import {Schema} from "mongoose";
import {ImanufactoringOrder, ManufacotringOrderModel} from "../types";
import {ObjectId} from "mongodb";

export const manufactoringOrderSchema = new Schema<ImanufactoringOrder, ManufacotringOrderModel>({
    reference: Number,
    bom: {bomId: ObjectId, name: String},
    product: {productId: ObjectId, name: String},
    componentStatus: [{_id: ObjectId, name: String, required: Number, status: Boolean}],
    quantity: {produced: Number, toProduce: Number},
    creationDate: Date,
    dueDate: Date,
    doneDate: Date,
    isDone: Boolean
})



