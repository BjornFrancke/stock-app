import { model } from "mongoose";
import {ImanufacturingOrder, Iorder, ManufacturingOrderModel, OrderModel} from "../types";
import {manufacturingOrderSchema} from "../schema/manufacturingOrderSchema";


export const ManufacturingOrder: ManufacturingOrderModel = model<ImanufacturingOrder, ManufacturingOrderModel>("ManufactoringOrder", manufacturingOrderSchema)
