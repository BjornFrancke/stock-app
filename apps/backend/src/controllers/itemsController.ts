import {Item, setStock} from "../items";
import {Iitems} from "../types";
import asyncHandler from "express-async-handler"
import {Bom} from "../bom";


const fetchAllItems = async (): Promise<Iitems[]> => {
    try {
        return await Item.find();
    } catch (error) {
        throw new Error("Failed to fetch items: " + error);
    }
};

export const getItems = asyncHandler(async (req, res) => {
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
    res.status(200).json(deletedItem);
})

export const setItemStock = asyncHandler(async (req, res) => {
    const itemId = req.params.itemId;
    const newStock = Number(req.params.newStock)
    try {
        const updatedItem = await setStock(itemId, newStock);
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: "Failed to update item stock" });
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
        res.json(savedItem);
    } catch {
        res.status(500).send("Internal Server Error");
    }
})