import {Schema, model, HydratedDocument} from "mongoose"
import {Iitems, ItemsModel} from "./types";

export const itemSchema = new Schema<Iitems, ItemsModel>({
    name: {type: String},
    description: {type: String},
    stock: {type: Number}
})


export const Item: ItemsModel = model<Iitems, ItemsModel>('Item', itemSchema)


export function listAllItems() {
    const response = Item.find()
    return response
}

export async function reduceStock(itemData: any, amount: number){
    itemData.stock -= amount;
    await itemData.save();
}


export function isStockSufficient(itemData: any, requiredAmount: number){
    return itemData && itemData.stock >= requiredAmount;
}