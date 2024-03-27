import express from "express";
import {Item} from "../../items";
import {Error} from "mongoose";


const itemRouter = express.Router()


itemRouter.route('/findAll')
    .get(async(req, res) => {
    try {
        const data = await Item.find()
        res.json(data)
    } catch {
        res.status(500).send("Internal Server Error");
    }
    })


itemRouter.route('/delete/:itemId')
    .delete(async (req, res) => {
        try {
            const deletedItem = await Item.findByIdAndDelete(req.params.itemId);
            res.json(deletedItem)
        } catch {
            res.status(500).send("Internal Server Error");
        }
    })

itemRouter.route('/create')
    .post(async (req, res) => {
        try {
            const newItem = new Item(
                {
                    name: req.body.name,
                    description: req.body.description,
                    stock: req.body.stock
                }
            );
            const savedItem = await newItem.save();
            res.json(savedItem);
        } catch {
            res.status(500).send("Internal Server Error");
        }
    })


itemRouter.route('/findById/:itemId')
    .get(async (req, res) => {
    try {
        const itemData = await Item.findById(req.params.itemId)
        res.json(itemData)
    } catch {
        res.status(500).send("Internal Server Error")
    }
})

itemRouter.route('/update/:itemId')
    .patch(async (req, res) => {
        try{
            const id = req.params.itemId
            const updatedData = req.body
            const options = {new: true}

            const results = await Item.findByIdAndUpdate(
                id, updatedData, options
            )
            res.send(results)
        } catch (error) {
            res.status(400).json({ message: error})
        }
    })

itemRouter.route('/setStock/:itemId/:newStock')
    .patch(async (req, res) => {
        try{
            const id = req.params.itemId
            const newStock: number = Number(req.params.newStock)
            const item = await Item.findById(id);
            if (item) {
                item.stock = newStock;
            } else {
                throw new Error("Item not found");
            }
            const updatedItem = await item.save();
            res.send(updatedItem);

        } catch {
            res.status(500).send("Internal Server Error");
        }
    })

export default itemRouter