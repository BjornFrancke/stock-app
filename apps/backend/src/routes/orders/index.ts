import express from "express";
import { Order } from "../../models/orders";
import mongoose from "mongoose";
import { Item } from "../../items";
import {orderMarkedAsDone} from "../../orders";

const ordersRoute = express.Router()


ordersRoute.route('/findAll')
.get(async (reg, res) => {
    try {
        const data = await Order.find()
        res.json(data)
    } catch {
        res.status(500).send("Internal Server Error");
    }
})

ordersRoute.route('/create')
.post(async (req, res) => {
    const creationDate = Date.now()
    try {
        const newOrder = new Order(
            {
                orderNumber: req.body.orderNumber,
                items: [],
                createtionDate: creationDate,
                dueDate: req.body.dueDate,
                receptian: req.body.receptian,
                isDone: false
            }
        );
        const savedOrder = await newOrder.save();
        res.json(savedOrder);
    } catch {
        res.status(500).send("Internal Server Error");
    }
})

ordersRoute.route('/markAsDone/:orderId')
.patch(async (req, res) => {
    const orderId = req.params.orderId
    try {
        console.log("Order found")
        if (orderId) {
            console.log("Order exist")
            const updatedOrder = await orderMarkedAsDone(orderId)
            res.send(updatedOrder)
        } else {
            throw new Error("Item not found");
            res.status(404).send(Error)
        }
    } catch {
        res.status(500).send("Internal Server Error");
    }
})

ordersRoute.route('/:orderId/additem')
.patch(async (req, res) => {
    const orderId = req.params.orderId;
    const itemId = req.body.itemId
    const amount = Number(req.body.amount);

    if (!amount) {
        return res.status(400).send("Item amount is required");
    }

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).send("Order not found");
        }

        const newItem = { _id: itemId, amount: amount };
        order.items.push(newItem);

        const updatedOrder = await order.save(); 
        res.json(updatedOrder); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


ordersRoute.route('/delete/:orderId')
    .delete(async (req, res) => {
        try {
            const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
            if (!deletedOrder) {
                res.status(404).send("The order was not found")
            }
            res.json(deletedOrder)
        } catch {
            res.status(500).send("Internal Server Error");
        }
    })

export default ordersRoute