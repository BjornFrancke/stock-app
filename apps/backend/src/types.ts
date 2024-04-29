import {ObjectId} from "mongodb";
import { Model } from "mongoose";
import {Request} from "express";

export interface Iitems {
    _id?: ObjectId,
    name: string,
    description?: string,
    stock: number,
    salePrice: {
        currency: string,
        amount: number
    }
}


export interface Iaddress {
    street: string,
    zip: number,
    city: string,
    country: string
}

export interface Ibom {
    _id?: ObjectId,
    name: string,
    product: ObjectId | string,
    components: [{id: ObjectId, amount: number, _id?: ObjectId}]
}

export interface Iorder {
    orderNumber: number,
    items: [{_id: ObjectId, amount: number, salesPrice: {amount: number, vat?: number, discount?: number, currency: string }}],
    createtionDate: Date,
    dueDate: Date,
    receptian?: string,
    subTotal?: {
        amount: number,
        currency: string,
        vat?: number
    },
    isDone?: boolean
}

export interface Icustomer {
    _id?: ObjectId | string,
    name: string,
    mailAdress: string,
    phoneNr?: string,
    address: Iaddress
}

export interface ImanufacturingOrder {
    _id?: ObjectId,
    reference: number,
    product: {productId: ObjectId, name: string },
    bom: {bomId: ObjectId, name: string},
    componentStatus?: {_id: ObjectId, name?: string, required: number, status: boolean}[]
    quantity: {produced: number, toProduce: number},
    creationDate: Date,
    dueDate?: Date,
    doneDate?: Date,
    isDone: boolean

}

export interface Iuser {
    _id?: ObjectId,
    name: string,
    email: string,
    password: string,
    token: string
}

export interface ExtendedRequest extends Request {
    user?: Iuser
}

export type CustomerModel = Model<Icustomer>
export type ItemsModel = Model<Iitems>
export type BomModel = Model<Ibom>
export type OrderModel = Model<Iorder>
export type ManufacturingOrderModel = Model<ImanufacturingOrder>
export type UserModel = Model<Iuser>
