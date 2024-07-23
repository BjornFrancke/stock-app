import express from "express";
import {protect} from "../middleware/authMiddleware";
import {
    addItemToOrder,
    calculateOrderSubTotal,
    createOrder,
    deleteOrder,
    getOrders, getPendingOrders,
    markOrderAsDone, updatedItemInOrder
} from "../controllers";

export const ordersRouter = express.Router()


ordersRouter.route('/')
    .get(protect, getOrders)
    .post(protect, createOrder)

ordersRouter.route('/status')
    .get(getPendingOrders)

ordersRouter.route('/:orderId')
    .delete(protect, deleteOrder)

ordersRouter.route('/markAsDone/:orderId')
    .patch(protect, markOrderAsDone)

ordersRouter.route('/:orderId/item')
    .post(protect, addItemToOrder);

ordersRouter.route('/:orderId/item/:itemId')
    .patch(protect, updatedItemInOrder)

ordersRouter.route('/orderSubtotal/:orderId')
    .get(protect, calculateOrderSubTotal)

