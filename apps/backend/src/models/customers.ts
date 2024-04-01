import { model } from "mongoose";
import { customerSchema } from "../schema/customers";
import { CustomerModel, Icustomer } from "../types";

export const Customer: CustomerModel = model<Icustomer, CustomerModel>("Customer", customerSchema)
