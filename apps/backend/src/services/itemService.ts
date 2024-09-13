import {Item} from "../models";
import {Error} from "mongoose";
import {Iitems} from "../types";

export const setStock = async (itemId: string, newStock: number) => {
    const item = await Item.findById(itemId);
    if (!item) {
        throw new Error("Item not found");
    }
    item.stock = newStock;
    return await item.save();
}
export async function reduceStock(itemData: any, amount: number) {
    itemData.stock -= amount;
    await itemData.save();
}

export function isStockSufficient(itemData: any, requiredAmount: number) {
    return itemData && itemData.stock >= requiredAmount;
}

export const fetchAllItems = async ({ascending, method}: { method: "STOCK" | "PRICE", ascending?: boolean }): Promise<Iitems[]> => {
    try {
        if (method === "STOCK") {
            return await sortItemsByStock(ascending)
        }
        return await Item.find();
    } catch (error) {
        throw new Error("Failed to fetch items: " + error);
    }
};


export async function sortItemsByStock(ascending?: boolean) {
    const items = await Item.find()
    let sorted: Iitems[]
    if (ascending) {
        sorted = items.sort((a, b) => b.stock - a.stock);
    } else {
        sorted = items.sort((a, b) => b.stock - a.stock);
    }
    return sorted;
}
