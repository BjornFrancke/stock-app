import asyncHandler from "express-async-handler"
import {Order} from "../models";
import {ObjectId} from "mongodb";
import {getNewOrderNumber, getOrderSubTotal, orderMarkedAsDone} from "../services/orderService";

export const getOrders = asyncHandler(async (req, res) => {
    try {
        const data = await Order.find()
        res.json(data)
    } catch {
        res.status(500).send("Internal Server Error");
    }
})

export const createOrder = asyncHandler(async (req, res) => {
    const creationDate = Date.now()
    const newOrderNumber = await getNewOrderNumber()
    try {
        const newOrder = new Order(
            {
                orderNumber: newOrderNumber,
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

export const markOrderAsDone = asyncHandler(async (req, res) => {
    const orderId = req.params.orderId
    try {
        if (orderId) {
            const updatedOrder = await orderMarkedAsDone(orderId)
            res.status(400).send(updatedOrder)
        } else {
            res.status(404).send("error")
        }
    } catch {
        res.status(500).send("Internal Server Error");
    }
})

export const addItemToOrder = asyncHandler(async (req, res) => {
    const orderId = req.params.orderId;
    const itemId: ObjectId = req.body.itemId
    const name = req.body.name
    const amount = Number(req.body.amount);
    const salesPrice: {amount: number, currency: string} = {
        amount: Number(req.body.salesPrice.amount),
        currency: req.body.salesPrice.currency
    }

    if (!amount) {
        res.status(400).send("Item amount is required");
        return
    }

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            res.status(404).send("Order not found");
            return
        }

        const newItem = { _id: itemId, name: name, amount: amount, salesPrice: salesPrice };
        order.items.push(newItem);

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

export const deleteOrder = asyncHandler(async (req, res) => {
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

export const calculateOrderSubTotal = asyncHandler(async (req, res) => {
    const sub = await getOrderSubTotal(req.params.orderId)
    res.json({subtotal: {amount: sub}})
})
