import asyncHandler from "express-async-handler"
import {Bom, Item} from "../models";
import {processBom} from "../services/manufacturingService";


export const getBoms = asyncHandler(async (req, res) => {
    try {
        const data = await Bom.find()
        res.status(200).json(data)
    } catch {
        res.status(500).send("Internal Server Error");
    }
})

export const getBomById = asyncHandler(async (req, res) => {
    const bomId = req.params.bomId;
    try {
        const data = await Bom.findById(bomId);
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).send("Bom not found");
        }
    } catch {
        res.status(500).send("Internal Server Error");
    }
})

export const deleteBom = asyncHandler(async (req, res) => {
    const bomId = req.params.bomId;
    try {
        const deletedBom = await Bom.findByIdAndDelete(bomId)
        res.status(200).json({message: `${deletedBom?.name || "The BOM"} was deleted`})
    } catch {
        res.status(500).send("Internal Server Error")
    }

})


export const getBomDetails = asyncHandler(async (req, res) => {
    const bomId = req.params.bomId;
    if (!bomId) {
        res.status(400).send("Bom ID is missing");
    }
    try {
        const bomData = await Bom.findById(bomId);
        if (!bomData) {
            res.status(404).send("BOM not found");
            return
        }
        const bomDataProduct = await Item.findById(bomData.product);
        if (!bomDataProduct) {
            res.status(404).send("Product not found");
            return
        }

        const componentsPromises = bomData.components.map(async component => {
            const componentRes = await Item.findById(component.id);
            return {
                id: component.id,
                name: componentRes?.name,
                description: componentRes?.description,
                amount: component.amount,
                stock: componentRes?.stock
            };
        });

        const componentsWithDetails = await Promise.all(componentsPromises);

        const newBomData = {
            id: bomId,
            name: bomData.name,
            product: {
                name: bomDataProduct.name,
                id: bomDataProduct._id
            },
            components: componentsWithDetails
        };
        res.status(200).json(newBomData);
        return
    } catch (error) {
        console.error("Error finding BOM with names by ID:", error);
        res.status(500).send("Internal Server Error: " + error);
    }
})


export const addComponent = asyncHandler(async (req, res) => {
    const bomId = req.params.bomId
    const newComponentId = req.body.componentId
    const newComponentAmount: number = Number(req.body.componentAmount)
    try {
        const bom = await Bom.findById(bomId);
        const newComponent = await Item.findById(newComponentId);

        if (!bom) {
            res.status(404).send("BOM not found");
            return
        }
        if (!newComponent) {
            res.status(404).send("Component not found")
            return
        }

        bom.components.push({ id: newComponentId, amount: newComponentAmount });

        const updatedBom = await bom.save();
        res.json({message: `Component added to ${updatedBom.name}`, ...updatedBom});
    } catch {
        res.status(500).json({message:"Internal Server Error"})
    }
})

export const removeComponent = asyncHandler(async (req, res) => {
    const bomId = req.params.bomId;
    const componentId = req.params.componentId;
    try {
        const bom = await Bom.findById(bomId);
        if (!bom) {
            res.status(404).json({message: "Bom not found"});
            return
        }
        const componentIndex = bom.components.findIndex(c => c.id.toString() === componentId);
        if (componentIndex === -1) {
            res.status(404).json({message: "Component not found in BOM"});
            return
        }
        bom.components.splice(componentIndex, 1);

        const updatedBom = await bom.save();
        res.json({message: `Component was removed`, ...updatedBom});

    } catch (error) {
        console.error("Error removing component from BOM:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
})

export const setComponentAmount = asyncHandler(async (req, res) => {
    const bomId = req.params.bomId
    const componentId = req.params.componentId
    const newAmount = Number(req.params.amount);
    try {
        const bom = await Bom.findById(bomId)
        if (!bom) {
            res.status(404).send("BOM not found");
            return
        }
        const componentIndex = bom.components.findIndex(c => c.id.toString() == componentId);
        if (componentIndex === -1) {
            res.status(404).send("Component not found in BOM");
            return
        }
        bom.components[componentIndex].amount = newAmount;

        const updatedBom = await bom.save();
        res.json(updatedBom);

    } catch (error) {
        console.error("Error updating component amount:", error);
        res.status(500).send("Internal Server Error");
    }
})

export const createBom = asyncHandler(async (req, res) => {
    try {
        const newBom = new Bom({
            name: req.body.name,
            product: req.body.product,
            components: []
        })
        const bomAdded = await newBom.save()
        res.status(200).json({message: `BOM: ${bomAdded.name} was created`, ...bomAdded})
    } catch {
        res.status(500).json({message: "Internal Server Error"})
    }
})

export const manufactureBom = asyncHandler(async (req, res) => {
    const bomId = req.params.bomId
    try {
        const response = await processBom(bomId)
        res.json(response)
    } catch {
        res.status(500).send("Internal Server Error");
    }
})
