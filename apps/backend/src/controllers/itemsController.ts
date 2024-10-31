import asyncHandler from "express-async-handler"
import {Bom, Item} from "../models";
import {fetchAllItems, setStock, sortItemsByPrice, sortItemsByStock} from "../services/itemService";


export const getItems = asyncHandler(async (req, res) => {
    try {
        const {sortMethod, ascending} = req.query;
        console.log(ascending)
        if (sortMethod === "STOCK") {
            const items = ascending === "true" ? await sortItemsByStock(true) : await sortItemsByStock(false)
            res.status(200).json(items)
        } else if (sortMethod === "PRICE") {
            const items = ascending === "true" ? await sortItemsByPrice(true) : await sortItemsByPrice(false)
            res.status(200).json(items)
        } else {
            const items = await fetchAllItems()
            res.status(200).json(items);
        }
    } catch (error) {
        res.status(500).json({message: "Failed to get items"});
    }
})

export const getItemsById = asyncHandler(async (req, res) => {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    if (!item) {
        res.status(404).json({message: "Item not found"});
        return;
    }
    res.status(200).json(item);
})

export const deleteItem = asyncHandler(async (req, res) => {
    const itemId = req.params.itemId;
    const isItemUsedInBom = await Bom.findOne({"components.id": itemId});
    if (isItemUsedInBom) {
        res.status(403).json({message: "Item is used in a BOM and cannot be deleted"});
        return
    }
    const deletedItem = await Item.findByIdAndDelete(itemId);
    res.status(202).send(`${deletedItem?.name} was deleted`);
})

export const setItemStock = asyncHandler(async (req, res) => {
    const itemId = req.params.itemId;
    const newStock = Number(req.params.newStock)
    try {
        const updatedItem = await setStock(itemId, newStock);
        res.status(200).json({message: `${updatedItem?.name}'s stock was updated`});
    } catch (error) {
        res.status(500).json({message: "Failed to update item stock"});
    }
})

export const setItemPrice = asyncHandler(async (req, res) => {
    const itemId = req.params.itemId;
    const newPrice = {
        amount: Number(req.body.amount),
        currency: req.body.currency
    };
    try {
        const item = await Item.findById(itemId)
        if (!item) {
            res.status(404).json({message: "Item not found"});
            return
        }
        item.salePrice = newPrice;
        await item.save();
        res.status(201).json({message: "Item was updated"})
    } catch (error) {
        res.status(500).json({message: "Failed to update item price"});
    }
})

export const createItem = asyncHandler(async (req, res) => {
    try {
        const {name, description, stock} = req.body;
        const newItem = new Item({name, description, stock});
        const savedItem = await newItem.save();
        res.status(201).json({message: `${savedItem?.name} was created`, ...savedItem});
    } catch {
        res.status(500).json({message: "Internal Server Error"});
    }
})

export const updateItemDescription = asyncHandler(async (req, res) => {
    const itemData = await Item.findById(req.params.itemId)
    if (!itemData) {
        res.status(404).json({message: "Item not found"});
        return
    }
    if (!req.body.description) {
        res.status(406).json({message: "No description was provided"});
    }
    itemData.description = req.body.description;
    await itemData.save()
    res.status(202).json({message: "Item was updated"})

})

export const updateItemById = asyncHandler(async (req, res) => {
    try {
        const id = req.params.itemId
        const updatedData = req.body
        const options = {new: true}

        const results = await Item.findByIdAndUpdate(
            id, updatedData, options
        )
        res.status(201).send(results)
    } catch (error) {
        res.status(400).json({message: error})
    }
})
