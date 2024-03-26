import {Schema, Model, model, HydratedDocument} from "mongoose"
import {Iitems} from "./types";

type ItemsModel = Model<Iitems>
const itemSchema = new Schema<Iitems, ItemsModel>({
    name: {type: String},
    description: {type: String},
    stock: {type: Number}
})


const Item: ItemsModel = model<Iitems, ItemsModel>('Item', itemSchema)

export const item: HydratedDocument<Iitems> = new Item({
    name: "PSU",
    description: "1000 watt power supply",
    stock: 3
})

export const logItemData = (item: HydratedDocument<Iitems>): void => {
    console.log("Name: " + item.name)
    console.log("Description: " + item.description)
    console.log("Stock: " + item.stock)
}

