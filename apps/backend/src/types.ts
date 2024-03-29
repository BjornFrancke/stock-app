import {ObjectId} from "mongodb";
import { Date, Model } from "mongoose";

export interface Iitems {
    _id?: ObjectId | string,
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
    _id?: ObjectId | string
    name: string,
    product: ObjectId | string,
    components: [{id: ObjectId | string, amount: number, _id?: ObjectId | string}]
}

export interface Iorder {
    orderNumber: number,
    items: [{_id: ObjectId, amount: number}]
    createtionDate: Date,
    dueDate: Date,
    receptian?: string,
    isDone?: boolean
}

export interface Icustomer {
    _id?: ObjectId | string,
    name: string,
    mailAdress: string,
    phoneNr?: string,
    address: Iaddress
}
export type CustomerModel = Model<Icustomer>
export type ItemsModel = Model<Iitems>
export type BomModel = Model<Ibom>
export type OrderModel = Model<Iorder>

