import express from "express";
import {
    checkManufacturingOrderById,
    createManuOrder,
    deleteManufacturingOrder,
    getAllManufacturingOrders,
    getManufacturingOrderById, processManufacturingOrderById
} from "../../controllers";

const manufacturingRouter = express.Router()

manufacturingRouter.route('/')
    .get(getAllManufacturingOrders)
    .post(createManuOrder)

manufacturingRouter.route('/:manufacturingOrder')
    .delete(deleteManufacturingOrder)
    .get(getManufacturingOrderById)
    .patch(processManufacturingOrderById)

manufacturingRouter.route('/check/:manufacturingOrder')
    .patch(checkManufacturingOrderById)

export default manufacturingRouter
