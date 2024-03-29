import { model } from "mongoose";
import { orderSchema } from "../schema/orders";
import { Iorder, OrderModel } from "../types";


export const Order: OrderModel = model<Iorder, OrderModel>("Order", orderSchema)
