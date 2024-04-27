import {Iitems, ItemsModel} from "../types";
import {model} from "mongoose";
import {itemSchema} from "../schema/itemSchema";

export const Item: ItemsModel = model<Iitems, ItemsModel>('Item', itemSchema)
