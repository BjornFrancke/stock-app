import { model } from "mongoose";
import { orderSchema } from "../schema/orderSchema";
import { Iorder, OrderModel } from "../types";


export const Order: OrderModel = model<Iorder, OrderModel>("Order", orderSchema)
