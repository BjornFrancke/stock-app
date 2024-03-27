import express from "express";
import { Bom } from "../../bom";

const bomRouter = express.Router()

bomRouter.route('/findAll')
    .get(async(req, res) => {
    try {
        const data = await Bom.find()
        res.json(data)
    } catch {
        res.status(500).send("Internal Server Error");
    }
    })


export default bomRouter