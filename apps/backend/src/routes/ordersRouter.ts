import express from "express";
import {protect} from "../middleware/authMiddleware";
import {
    addItemToOrder,
    calculateOrderSubTotal,
    createOrder,
    deleteOrder,
    getOrders,
    markOrderAsDone
} from "../controllers";

export const ordersRouter = express.Router()


ordersRouter.route('/findAll')
    .get(protect, getOrders)

ordersRouter.route('/create')
    .post(protect, createOrder)

ordersRouter.route('/markAsDone/:orderId')
    .patch(protect, markOrderAsDone)

ordersRouter.route('/:orderId/additem')
    .patch(protect, addItemToOrder);


ordersRouter.route('/delete/:orderId')
    .delete(protect, deleteOrder)

ordersRouter.route('/orderSubtotal/:orderId')
    .get(protect, calculateOrderSubTotal)

