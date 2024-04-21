import express from "express";
import {
    checkManufacturingOrderById,
    createManuOrder,
    deleteManufacturingOrder,
    getAllManufacturingOrders,
    getManufacturingOrderById, processManufacturingOrderById
} from "../../controllers";
import {protect} from "../../middleware/authMiddleware";

const manufacturingRouter = express.Router()

manufacturingRouter.route('/')
    .get(protect, getAllManufacturingOrders)
    .post(protect, createManuOrder)

manufacturingRouter.route('/:manufacturingOrder')
    .delete(protect, deleteManufacturingOrder)
    .get(protect, getManufacturingOrderById)
    .patch(protect, processManufacturingOrderById)

manufacturingRouter.route('/check/:manufacturingOrder')
    .patch(protect, checkManufacturingOrderById)

export default manufacturingRouter
