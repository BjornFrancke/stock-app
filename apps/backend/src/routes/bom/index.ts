import express from "express";
import { Bom } from "../../bom";
import { Item } from "../../items";

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

bomRouter.route('/findById/:bomId')
.get(async(req, res) => {
    const id = req.params.bomId
    try{
        const data = await Bom.findById(id)
        res.json(data)
    } catch {
        res.status(500).send("internal Server Error")
    }
})


bomRouter.route('/delete/:bomId')
.delete(async (req, res) => {
    const id = req.params.bomId
    try {
        const deletedBom = Bom.findByIdAndDelete(id)
        res.json(deletedBom)
    } catch {
        res.status(500).send("Internal Server Error")
    }
})

bomRouter.route('/addComponent/:bomId')
.patch(async (req, res) => {
    const id = req.params.bomId
    const newComponentId = req.body.componentId
    const newComponentAmount: number = Number(req.body.componentAmount)
    try {
        const bom = await Bom.findById(id)
        const newComponent = await Item.findById(newComponentId)
        if (newComponent && bom){
            bom?.components.push({id: newComponentId, amount: newComponentAmount})

        } else {
            throw new Error("Component not found");
        }
        const updateBom = await bom.save
        res.send(updateBom)
    } catch {
        res.status(500).send("Internal Server Error")
    }
})

bomRouter.route('/setComponentAmount/:bomId/:componentId')
    .patch(async (req, res) => {
        const bomId = req.params.bomId
        const componentId = req.params.componentId
        try {
            const bom = await Bom.findById(bomId)

        } catch {
            res.status(500).send("Internal Server Error")
        }
    })


export default bomRouter