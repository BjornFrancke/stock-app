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
            const deletedBom = await Bom.findByIdAndDelete(id)
            res.json(deletedBom)
        } catch {
            res.status(500).send("Internal Server Error")
        }
    })

bomRouter.route('/addComponent/:bomId')
.patch(async (req, res) => {
    const bomId = req.params.bomId
    const newComponentId = req.body.componentId
    const newComponentAmount: number = Number(req.body.componentAmount)
    try {
        const bom = await Bom.findById(bomId); // Find the BOM by its ID
        const newComponent = await Item.findById(newComponentId); // Find the component by its ID

        if (!bom) {
            return res.status(404).send("BOM not found");
        }
        if (!newComponent) {
            return res.status(404).send("Component not found")
        }

        // Push the new component and its amount to the BOM's components array
        bom.components.push({ id: newComponentId, amount: newComponentAmount });

        const updatedBom = await bom.save(); // Correctly call the save method to update the BOM in the database
        res.json(updatedBom); // Send the updated BOM as a response
    } catch {
        res.status(500).send("Internal Server Error")
    }
})

bomRouter.route('/setComponentAmount/:bomId/:componentId/:amount')
    .patch(async (req, res) => {
        const bomId = req.params.bomId
        const componentId = req.params.componentId
        const newAmount = Number(req.params.amount); // Assuming amount is passed as a string and needs to be an integer
        try {
            const bom = await Bom.findById(bomId)
            if (!bom) {
                return res.status(404).send("BOM not found");
            }
            const componentIndex = bom.components.findIndex(c => c.id == componentId);
            if (componentIndex === -1) {
                return res.status(404).send("Component not found in BOM");
            }
            bom.components[componentIndex].amount = newAmount;

            const updatedBom = await bom.save();
            res.json(updatedBom);

        } catch (error) {
            console.error("Error updating component amount:", error);
            res.status(500).send("Internal Server Error");
        }
    })

bomRouter.route('/create')
.post(async (req, res) => {
    try {
        const newBom = new Bom({
            name: req.body.name,
            product: req.body.product,
            components: []
        })
        const bomAdded = await newBom.save()
        res.send(bomAdded)
    } catch {
        res.status(500).send("Internal Server Error")
    }
})

export default bomRouter