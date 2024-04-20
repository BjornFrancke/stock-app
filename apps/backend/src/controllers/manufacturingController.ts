import asyncHandler from "express-async-handler"
import {ManufacturingOrder} from "../models/manufacturingOrder";
import {createManufacturingOrder, getBOMComponentStatus, processManufacturingOrder} from "../manufacturing";

export const getAllManufacturingOrders = asyncHandler(async (req, res) => {
    try {
        const manuOrders = await ManufacturingOrder.find()
        res.send(manuOrders)
    } catch {
        res.status(500).send("Internal Server Error")
    }
})

export const createManuOrder = asyncHandler(async (req, res) => {
    try {
        const bomId = req.body.bomId
        const quantity = req.body.quantity
        const dueDate = new Date(req.body.dueDate)
        const savedManuOrder = await createManufacturingOrder(bomId, quantity, dueDate)
        res.json(savedManuOrder)
    } catch (error) {
        res.status(500).send("error" + error)
    }
})

export const deleteManufacturingOrder = asyncHandler(async (req, res) => {
    try {
        await ManufacturingOrder.findByIdAndDelete(req.params.manufacturingOrder);
        res.send("Manufacturing Order deleted successfully");
    } catch {
        res.status(500).send("Internal Server Error")
    }
})

export const getManufacturingOrderById = asyncHandler (async (req, res) => {
    const manuOrder = await ManufacturingOrder.findById(req.params.manufacturingOrder);
    try {
        if (manuOrder) {
            res.json(manuOrder);
        } else {
            res.status(404).send("Manufacturing Order not found");
        }
    } catch {
        res.status(500).send("Internal Server Error")
    }
})

export const processManufacturingOrderById  = asyncHandler(async (req, res) => {
    try {
        await processManufacturingOrder(req.params.manufacturingOrder, req.body.produce)
    } catch {
        res.status(500).send("Internal Server Error");
    }
})

export const checkManufacturingOrderById = asyncHandler(async (req, res) => {
    const manuOrder = await ManufacturingOrder.findById(req.params.manufacturingOrder)
    if (manuOrder) {
        const bomId = manuOrder.bom.bomId;
        const toProduce = manuOrder.quantity.toProduce;
        const isAvailable = await getBOMComponentStatus(bomId, toProduce);
        if (isAvailable) {
            manuOrder.componentStatus = isAvailable
            const updatedManuOrder = await manuOrder.save()
            res.json(updatedManuOrder)
        } else {
            // Perform the necessary actions when the BOM components are not available
        }
    } else {
        res.status(404).send("Manufactoring Order not found");
    }
})