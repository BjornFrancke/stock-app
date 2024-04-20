import express from "express";
import {Item} from "../../items";
import {createItem, deleteItem, getItems, getItemsById, setItemStock} from "../../controllers";


const itemRouter = express.Router()

itemRouter.route('/findAll')
    .get(getItems)

itemRouter.route('/delete/:itemId')
    .delete(deleteItem)

itemRouter.route('/create')
    .post(createItem)


itemRouter.route('/findById/:itemId')
    .get(getItemsById)

itemRouter.route('/setStock/:itemId/:newStock')
    .patch(setItemStock)


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






export default itemRouter