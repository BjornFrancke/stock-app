import { Schema } from "mongoose";
import { BomModel, Ibom } from "../types";
import { ObjectId } from "mongodb";

export const bomSchema = new Schema<Ibom, BomModel>({
    name: String,
    product: ObjectId,
    components: [{id: ObjectId, amount: Number}]
})
