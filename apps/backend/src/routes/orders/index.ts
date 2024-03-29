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
                receptian: req.body.receptian
            }
        );
        const savedOrder = await newOrder.save();
        res.json(savedOrder);
    } catch {
        res.status(500).send("Internal Server Error");
    }
})

export default ordersRoute