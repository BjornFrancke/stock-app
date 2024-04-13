import express from "express";
import {ManufactoringOrder} from "../../models/manufactoringOrder";
import {bomComponentAvailable, getNewManuOrderNumber} from "../../manufactoring";

const manufactoringRouter = express.Router()

manufactoringRouter.route('/')
.get(async (req, res) => {
    try {
        const manuOrders = await ManufactoringOrder.find()
        res.send(manuOrders)
    } catch {
        res.status(500).send("Internal Server Error")
    }
})
.post(async (req, res) => {
    try {
        const nextOrderNumber = await getNewManuOrderNumber()
        const newManuOrder = new ManufactoringOrder({
            reference: nextOrderNumber,
            product: {
                productId: req.body.productId,
                name: req.body.productName
            },
            bom: {
                bomId: req.body.bomId,
                name: req.body.bomName
            },
            createtionDate: Date.now(),
            quantity: {
                produced: 0,
                toProduce: req.body.toProduce
            },
            isDone: false,
        })
        const savedManuOrder = await newManuOrder.save();
        res.json(savedManuOrder)
    } catch (error) {
    res.status(500).send("error" + error)
    }
})


manufactoringRouter.route('/:manufactoringOrder')
    .delete(async (req, res) => {
        try {
        await ManufactoringOrder.findByIdAndDelete(req.params.manufactoringOrder);
        res.send("Manufactoring Order deleted successfully");
        } catch {
            res.status(500).send("Internal Server Error")
        }
    })

manufactoringRouter.route('/check/:manufactoringOrder')
    .patch(async (req, res) => {
        console.log("Function starting")
        const manuOrder = await ManufactoringOrder.findById(req.params.manufactoringOrder)
        console.log("menu order found")
        if (manuOrder) {
            console.log("Menu order true")
            const bomId = manuOrder.bom.bomId;
            const toProduce = manuOrder.quantity.toProduce;
            const isAvailable = await bomComponentAvailable(bomId, toProduce);
            if (isAvailable) {
                console.log("menu available")
                manuOrder.componentStatus = isAvailable
                const updatedManuOrder = await manuOrder.save()
                res.json(updatedManuOrder)
            } else {
                // Perform the necessary actions when the BOM components are not available
            }
        } else {
            res.status(404).send("Manufactoring Order not found");
        }
    }
    )

export default manufactoringRouter
