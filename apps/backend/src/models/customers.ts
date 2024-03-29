import { model } from "mongoose";
import { customerrSchema } from "../schema/customers";
import { CustomerModel, Icustomer } from "../types";

export const Customer: CustomerModel = model<Icustomer, CustomerModel>("Customer", customerrSchema)
