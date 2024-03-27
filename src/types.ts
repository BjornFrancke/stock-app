import {ObjectId} from "mongodb";

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