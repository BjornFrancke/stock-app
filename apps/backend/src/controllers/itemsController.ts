import asyncHandler from "express-async-handler"
import {Bom, Item} from "../models";
import {fetchAllItems, setStock} from "../services/itemService";


export const getItems = asyncHandler(async (_req, res) => {
    try {
        const items = await fetchAllItems();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Failed to get items" });
    }
})


export const getItemsById = asyncHandler(async (req, res) => {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    if (!item) {
        res.status(404).send("Item not found");
        return;
    }
    res.status(200).json(item);
})

export const deleteItem = asyncHandler(async (req, res) => {
    const itemId = req.params.itemId;
    const isItemUsedInBom = await Bom.findOne({ "components.id": itemId });
    if (isItemUsedInBom) {
        res.status(403).send("Item is used in a BOM and cannot be deleted");
        return
    }
    const deletedItem = await Item.findByIdAndDelete(itemId);
    res.status(200).send(`${deletedItem?.name} was deleted`);
})

export const setItemStock = asyncHandler(async (req, res) => {
    const itemId = req.params.itemId;
    const newStock = Number(req.params.newStock)
    try {
        const updatedItem = await setStock(itemId, newStock);
        res.status(200).json({message: `${updatedItem?.name}'s stock was updated`});
    } catch (error) {
        res.status(500).json({ message: "Failed to update item stock" });
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
        res.status(200).json({message: "Item was updated"})
    } catch (error) {
        res.status(500).json({ message: "Failed to update item price" });
    }
})

export const createItem = asyncHandler(async (req, res) => {
    try {
        const newItem = new Item(
            {
                name: req.body.name,
                description: req.body.description,
                stock: req.body.stock
            }
        );
        const savedItem = await newItem.save();
        res.status(201).json({message: `${savedItem?.name} was created`, ...savedItem});
    } catch {
        res.status(500).send("Internal Server Error");
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
        res.send(results)
    } catch (error) {
        res.status(400).json({message: error})
    }
})
