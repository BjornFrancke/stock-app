import express from "express";
import {item, Item} from "../../items";


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

export default itemRouter