import express from "express";
import {Warehouse} from "../../warehouse";

const warehouseRouter = express.Router()

warehouseRouter.route('/findAll')
.get(async (reg, res) => {
    try {
        const data = await Warehouse.find()
        res.send(data)
    } catch {
        res.status(500).send("Internal Server Error");
    }
})

warehouseRouter.route('/delete/:warehouseId')
    .delete(async (req, res) => {
        try {
            const deletedWarehouse = await Warehouse.findByIdAndDelete(req.params.warehouseId);
            res.json(deletedWarehouse)
        } catch {
            res.status(500).send("Internal Server Error");
        }
    })

warehouseRouter.route('/create')
    .post(async (req, res) => {
        try {
            const newWarehouse = new Warehouse(
                {
                    name: req.body.name,
                    prefix: req.body.prefix,
                    items: []
                }
            );
            const savedWarehouse = await newWarehouse.save();
            res.json(savedWarehouse);
        } catch {
            res.status(500).send("Internal Server Error");
        }
    })

warehouseRouter.route('/findById/:warehouseId')
    .get(async (req, res) => {
        try {
            const warehouseData = await Warehouse.findById(req.params.warehouseId)
            res.json(warehouseData)
        } catch {
            res.status(500).send("Internal Server Error")
        }
    })


export default warehouseRouter