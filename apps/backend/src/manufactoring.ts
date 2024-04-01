import {ObjectId} from "mongodb";
import {Bom} from "./bom";
import {Ibom} from "./types";
import {Item} from "./items";



export async function processBom(bomId: ObjectId | string) {
    const bomData: Ibom | null = await Bom.findById(bomId)

    console.log(bomData?.name)
    console.log("Product id " + bomData?.product)
    if (!bomData) {
        console.log("error")
        return
    }
    const product = await Item.findById(bomData.product)
    console.log(product?.name)
    if (bomData) {
        for (let componentIndex = 0; componentIndex < bomData.components.length; componentIndex += 1) {
            const component = bomData.components[componentIndex];
            if (component._id) {
                const itemData = await Item.findById(component.id)
                console.log(itemData?.name)
                console.log(itemData?.stock)
                if (itemData && itemData.stock >= component.amount) {
                    itemData.stock -= component.amount;
                    console.log("New Item Stock" + itemData.stock)
                    await itemData.save();
                } else {
                    console.log("Insufficient stock for component: " + component.id);
                    return
                }
                console.log("Done with for loop")

            }

        }
        console.log("Finding product now")
        if (product) {
            console.log(product.name + product.stock)
            product.stock = product.stock + 1;
            await product.save();
            console.log("Success")
            return {
                message: "Success"
            }
        } else {
            console.log("Product not found");
            return
        }

    }


}