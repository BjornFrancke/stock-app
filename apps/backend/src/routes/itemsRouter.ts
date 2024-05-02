import express from "express";
import {protect} from "../middleware/authMiddleware";
import {createItem, deleteItem, getItems, getItemsById, setItemPrice, setItemStock} from "../controllers";
import {Item} from "../models";


export const itemRouter = express.Router()

itemRouter.route('/')
    .get(protect, getItems)
    .post(protect, createItem)

itemRouter.route('/:itemId')
    .get(protect, getItemsById)
    .delete(protect, deleteItem)

itemRouter.route('/:itemId/stock/:newStock')
    .patch(protect, setItemStock)

itemRouter.route('/:itemId/price')
    .patch(setItemPrice)


itemRouter.route('/getNameById/:itemId')
    .get(async (req, res) => {
        try {
            const itemData = await Item.findById(req.params.itemId)
            if (!itemData) {
                res.status(404).send("Item was not found")
            }
            const itemName = itemData?.name
            res.json(itemName)
        } catch {
            res.status(500).send("Internal Server Error")
        }
    })

itemRouter.route('/update/:itemId')
    .patch(async (req, res) => {
        try {
            const id = req.params.itemId
            const updatedData = req.body
            const options = {new: true}

            const results = await Item.findByIdAndUpdate(
                id, updatedData, options
            )
            res.send(results)
        } catch (error) {
            res.status(400).json({message: error})
        }
    })


