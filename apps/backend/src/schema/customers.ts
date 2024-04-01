import { Schema } from "mongoose";
import { CustomerModel, Icustomer } from "../types";

export const customerSchema = new Schema<Icustomer, CustomerModel>({
    name: String,
    mailAdress: String,
    phoneNr: String,
    address: {
        street: String,
        zip: Number,
        city: String,
        country: String
    }
    }
)



