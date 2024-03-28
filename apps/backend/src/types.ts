import {ObjectId} from "mongodb";
import { Date } from "mongoose";

export interface Iitems {
    name: string,
    description?: string,
    stock: number,
}

export interface Iwarehouse {
    name: string,
    prefix: string,
    address: Iaddress,
    items: [id: ObjectId]
}

export interface Iaddress {
    street: string,
    zip: number,
    city: string,
    country: string
}

export interface Ibom {
    name: string,
    product: ObjectId,
    components: [{id: ObjectId | string, amount: number}]
}

export interface Iorder {
    orderNumber: number,
    items: [{id: ObjectId, amount: number}]
    createtionDate: Date
    dueDate: Date,
    receptian?: string
}