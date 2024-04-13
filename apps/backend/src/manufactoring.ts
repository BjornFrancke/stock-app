import {ObjectId} from "mongodb";
import {Bom} from "./bom";
import {Ibom} from "./types";
import {isStockSufficient, Item, reduceStock} from "./items";
import {ManufactoringOrder} from "./models/manufactoringOrder";


/**
 * Processes a Bill of Materials (BOM).
 *
 * @param {ObjectId | string} bomId - The ID of the BOM to process.
 *
 * @returns {Promise<Object>} - A promise that resolves to an object with a message property indicating the result of the BOM processing.
 *                             The message property can have values: "Bom not found", "Success".
 */
export async function processBom(bomId: ObjectId | string) {
    const bomData: Ibom | null = await Bom.findById(bomId)

    console.log(bomData?.name)
    if (!bomData) {
        return {
            message: "Bom not found"
        }
    }
    const product = await Item.findById(bomData.product)
    if (bomData) {
        for (let componentIndex = 0; componentIndex < bomData.components.length; componentIndex += 1) {
            const component = bomData.components[componentIndex];
            if (component._id) {
                const itemData = await Item.findById(component.id)
                if (isStockSufficient(itemData, component.amount)) {
                    reduceStock(itemData, component.amount)

                } else {
                    console.log("Insufficient stock for component: " + component.id);
                    return
                }

            }

        }
        if (product) {
            console.log(product.name + product.stock)
            product.stock = product.stock + 1;
            await product.save();
            return {
                message: "Success"
            }
        } else {
            return
        }

    }


}

export async function getNewManuOrderNumber(){
    const latestManuOrder = await ManufactoringOrder.findOne().sort({reference: -1});
    const newOrderNumber = latestManuOrder ? latestManuOrder.reference + 1 : 1;
    return newOrderNumber;
}
export async function bomComponentAvailable(bomId: ObjectId, toProduce: number) {
    console.log("Next function")
    const bomData: Ibom | null = await Bom.findById(bomId);
    const componentStatus = []
    if (!bomData) {
        console.log("No bom data")
        return false
    }
    console.log("Bom data good")
    const components = bomData.components;
    for (let i = 0; i < components.length; i++) {
        console.log(i)
        const component = components[i];
        if (component.id){
            const itemData = await Item.findById(component.id);
        const isAvailable = await isStockSufficient(itemData, component.amount * toProduce);
        if (!isAvailable) {
            componentStatus.push(
                {
                    _id: component.id,
                    name: itemData?.name,
                    required: component.amount * toProduce,
                    status: false
                }
            )
        } else {
            componentStatus.push(
                {
                    _id: component.id,
                    name: itemData?.name,
                    required: component.amount * toProduce,
                    status: true
                })
        }
        }
    }
    return componentStatus

}



