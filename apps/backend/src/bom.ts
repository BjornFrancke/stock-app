import { Schema, model } from "mongoose";
import { BomModel, Ibom } from "./types";
import { ObjectId } from "mongodb";

const bomSchema = new Schema<Ibom, BomModel>({
    name: String,
    product: ObjectId,
    components: [{id: ObjectId, amount: Number}]
})

export const Bom: BomModel = model<Ibom, BomModel>("Bom", bomSchema)
