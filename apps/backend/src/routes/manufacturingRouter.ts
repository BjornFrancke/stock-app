import express from "express";
import {protect} from "../middleware/authMiddleware";
import {
    checkManufacturingOrderById,
    createManuOrder,
    deleteManufacturingOrder,
    getAllManufacturingOrders,
    getManufacturingOrderById,
    processManufacturingOrderById
} from "../controllers";


export const manufacturingRouter = express.Router()

manufacturingRouter.route('/')
    .get(protect, getAllManufacturingOrders)
    .post(protect, createManuOrder)

manufacturingRouter.route('/:manufacturingOrder')
    .delete(protect, deleteManufacturingOrder)
    .get(protect, getManufacturingOrderById)
    .patch(protect, processManufacturingOrderById)

manufacturingRouter.route('/check/:manufacturingOrder')
    .patch(protect, checkManufacturingOrderById)

