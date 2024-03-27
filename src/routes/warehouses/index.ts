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


export default warehouseRouter