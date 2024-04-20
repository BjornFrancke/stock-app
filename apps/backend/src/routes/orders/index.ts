import express from "express";
import { Order } from "../../models/orders";
import mongoose from "mongoose";
import { Item } from "../../items";
import {orderMarkedAsDone} from "../../orders";
import {addItemToOrder, createOrder, deleteOrder, getOrders, markOrderAsDone} from "../../controllers";

const ordersRoute = express.Router()


ordersRoute.route('/findAll')
.get(getOrders)

ordersRoute.route('/create')
.post(createOrder)

ordersRoute.route('/markAsDone/:orderId')
.patch(markOrderAsDone)

ordersRoute.route('/:orderId/additem')
.patch(addItemToOrder);


ordersRoute.route('/delete/:orderId')
    .delete(deleteOrder)

export default ordersRoute