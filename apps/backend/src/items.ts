import {Schema, model, HydratedDocument, Error} from "mongoose"
import {Iitems, ItemsModel} from "./types";
import {ObjectId} from "mongodb";

export const itemSchema = new Schema<Iitems, ItemsModel>({
    name: {type: String},
    description: {type: String},
    stock: {type: Number}
})


export const Item: ItemsModel = model<Iitems, ItemsModel>('Item', itemSchema)

export const setStock = async (itemId: string, newStock: number) => {
    const item = await Item.findById(itemId);
    if (!item) {
        throw new Error("Item not found");
    }
    item.stock = newStock;
    return await item.save();
}


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