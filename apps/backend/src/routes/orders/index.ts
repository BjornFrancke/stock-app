import express from "express";
import { Order } from "../../models/orders";
import mongoose from "mongoose";
import { Item } from "../../items";
import {orderMarkedAsDone} from "../../orders";
import {addItemToOrder, createOrder, deleteOrder, getOrders, markOrderAsDone} from "../../controllers";
import {protect} from "../../middleware/authMiddleware";

const ordersRoute = express.Router()


ordersRoute.route('/findAll')
.get(protect, getOrders)

ordersRoute.route('/create')
.post(protect, createOrder)

ordersRoute.route('/markAsDone/:orderId')
.patch(protect, markOrderAsDone)

ordersRoute.route('/:orderId/additem')
.patch(protect, addItemToOrder);


ordersRoute.route('/delete/:orderId')
    .delete(protect, deleteOrder)

export default ordersRoute