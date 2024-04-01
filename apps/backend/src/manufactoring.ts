import {ObjectId} from "mongodb";
import {Bom} from "./bom";
import {Ibom} from "./types";
import {Item} from "./items";


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
                console.log(itemData?.name)
                console.log(itemData?.stock)
                if (itemData && itemData.stock >= component.amount) {
                    itemData.stock -= component.amount;
                    await itemData.save();
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