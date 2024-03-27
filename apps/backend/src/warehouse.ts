import {Iwarehouse} from "./types";
import {HydratedDocument, model, Model, Schema} from "mongoose";
import {ObjectId} from "mongodb";
import {itemSchema} from "./items";

type WarehouseModel = Model<Iwarehouse>
const warehouseSchema = new Schema<Iwarehouse, WarehouseModel>({
    name: {type: String},
    prefix: {type: String},
    items: {type: [ObjectId]}
})

export const Warehouse: WarehouseModel = model<Iwarehouse, WarehouseModel>('Warehouse', warehouseSchema)

const warehouse: HydratedDocument<Iwarehouse> = new Warehouse({
    name: "My warehouse",
    prefix: "my",
    items: []
})

export function createWarehouse() {
    const testData = warehouse
    testData.save()
}