import express from "express";
import {protect} from "../middleware/authMiddleware";
import {
    createItem,
    deleteItem, getItemNameById,
    getItems,
    getItemsById,
    setItemPrice,
    setItemStock, updateItemById,
    updateItemDescription
} from "../controllers";


export const itemRouter = express.Router()

itemRouter.route('/')
    .get(protect, getItems)
    .post(protect, createItem)

itemRouter.route('/:itemId')
    .get(protect, getItemsById)
    .delete(protect, deleteItem)
    .patch(protect, updateItemById)

itemRouter.route('/:itemId/stock/:newStock')
    .patch(protect, setItemStock)

itemRouter.route('/:itemId/price')
    .patch(protect, setItemPrice)

itemRouter.route('/:itemId/description')
    .patch(protect, updateItemDescription)

itemRouter.route('/getNameById/:itemId')
    .get(protect, getItemNameById)

itemRouter.route('/update/:itemId')
    .patch(protect, updateItemById)


