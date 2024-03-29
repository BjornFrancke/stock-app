import express from "express";
import { Order } from "../../models/orders";

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
        const order = await Order.findById(orderId)
        if (order) {
            order.isDone = true
        } else {
            throw new Error("Item not found");
        }
        const updatedOrder = await order.save();
        res.send(updatedOrder);
    } catch {
        res.status(500).send("Internal Server Error");
    }
})

ordersRoute.route('/delete/:orderId')
    .delete(async (req, res) => {
        try {
            const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
            res.json(deletedOrder)
        } catch {
            res.status(500).send("Internal Server Error");
        }
    })

export default ordersRoute