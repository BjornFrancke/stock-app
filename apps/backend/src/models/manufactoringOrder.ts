import { model } from "mongoose";
import {ImanufactoringOrder, Iorder, ManufacotringOrderModel, OrderModel} from "../types";
import {manufactoringOrderSchema} from "../schema/manufactoringOrder";


export const ManufactoringOrder: ManufacotringOrderModel = model<ImanufactoringOrder, ManufacotringOrderModel>("ManufactoringOrder", manufactoringOrderSchema)
