import {Schema} from "mongoose";
import {Iitems, ItemsModel} from "../types";


export const itemSchema = new Schema<Iitems, ItemsModel>({
    name: {type: String},
    description: {type: String},
    stock: {type: Number},
    salePrice: {
        amount: {type: Number, default: 0},
        currency: {type: String},
    }
})
