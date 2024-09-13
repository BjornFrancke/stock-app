import asyncHandler from "express-async-handler"
import {Item, Order} from "../models";
import {ObjectId} from "mongodb";
import {getNewOrderNumber, getOrderSubTotal, getPendingOrderStatus, orderMarkedAsDone} from "../services/orderService";

export const getOrders = asyncHandler(async (req, res) => {
    try {
        const data = await Order.find()
        res.json(data)
    } catch {
        res.status(500).send("Internal Server Error");
    }
})

export const getPendingOrders = asyncHandler(async (req, res) => {
    const pendingOrder = await getPendingOrderStatus()
    res.status(200).json(pendingOrder)
})

export const createOrder = asyncHandler(async (req, res) => {
    const creationDate = Date.now()
    const newOrderNumber = await getNewOrderNumber()
    try {
        const {receptian, dueDate} = req.body;
        const newOrder = new Order(
            {
                orderNumber: newOrderNumber,
                items: [],
                createtionDate: creationDate,
                dueDate: dueDate,
                receptian: receptian,
                isDone: false,
                subTotal: {
                    amount: 0,
                    currency: "DKK",
                    discount: 0,
                    total: 0,
                    vat: 0,
                }
            }
        );
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch {
        res.status(500).send("Internal Server Error");
    }
})

export const markOrderAsDone = asyncHandler(async (req, res) => {
    const orderId = req.params.orderId
    console.log("running markOrderAsDone");
    console.log(orderId)
    if (orderId) {
        await orderMarkedAsDone(orderId).then((result) => {
            console.log(result.message + result.statusCode)
            res.status(result.statusCode).json({message: result.message})
            return
        }).catch(error => {
            res.status(500).send({message: error.message});
            return
        })
    } else {
        res.status(404).json({message: "Order was not found"})
        return
    }
})

export const updatedItemInOrder = asyncHandler(async (req, res) => {
   console.log("function called")
    const {orderId, itemId} = req.params
    const itemData = await Item.findById(itemId)
    const {amount, salesPriceAmount, vat, discount} = req.body
    const orderData = await Order.findById(orderId)
    if (!orderData || !itemData) {
        res.status(404).json({error: "Not found"})
        return
    }
    console.log(itemData.name)
    for (let index = 0; orderData.items.length > index; index++) {
        console.log(orderData.items[index]._id)
        if (orderData.items[index]._id.toString() === itemData._id.toString()) {
            console.log("item found")
            orderData.items[index].amount = amount;
            orderData.items[index].salesPrice.amount = salesPriceAmount;
            orderData.items[index].salesPrice.vat = vat;
            orderData.items[index].salesPrice.discount = discount;
            await orderData.save()
            res.status(200).json({message: "Item updated"})
        }
    }
    res.status(404).json({ error: 'Item not found in order' });
    return
})

export const addItemToOrder = asyncHandler(async (req, res) => {
    const orderId = req.params.orderId;
    const {itemId, name} = req.body
    const amount = Number(req.body.amount);
    const {discount, vat, currency} = req.body.salesPrice;
    const salesPrice: {amount: number, vat: number, discount: number, currency: string} = {
        amount: Number(req.body.salesPrice.amount),
        vat,
        discount,
        currency,
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

export const removeItemFromOrder = asyncHandler(async (req, res) => {
    const {orderId, itemId} = req.params;
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        const itemIndex = order.items.findIndex((item) => item._id.toString() === itemId);
        if (itemIndex === -1) {
            res.status(404).json({ message: "Item not found in order" });
            return;
        }
        order.items.splice(itemIndex, 1);
        await order.save();
        res.status(200).json({ message: "Item removed from order" });
    } catch (error) {
        res.status(500).json({ message: error });
    }
})

export const calculateOrderSubTotal = asyncHandler(async (req, res) => {
    const sub = await getOrderSubTotal(req.params.orderId)
    res.json({subtotal: {amount: sub}})
})
