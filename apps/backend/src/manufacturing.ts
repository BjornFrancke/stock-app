import {ObjectId} from "mongodb";
import {Bom} from "./bom";
import {Ibom} from "./types";
import {isStockSufficient, Item, reduceStock} from "./items";
import {ManufacturingOrder} from "./models/manufacturingOrder";


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

export async function processManufacturingOrder(orderId: ObjectId | string, toProduce: number) {
    const orderData = await ManufacturingOrder.findById(orderId)
    if (!orderData) {
        return
    }
    const bomId = orderData.bom.bomId
    for (let produced = 0; toProduce >= produced; produced++ ) {
        await processBom(bomId)
    }
    orderData.isDone = true
    orderData.quantity.produced = toProduce
    await orderData.save();
}

export async function getNewManuOrderNumber(){
    const latestManuOrder = await ManufacturingOrder.findOne().sort({reference: -1});
    const newOrderNumber = latestManuOrder ? latestManuOrder.reference + 1 : 1;
    return newOrderNumber;
}
export async function getBOMComponentStatus(bomId: ObjectId, toProduce: number) {
    const bomData: Ibom | null = await Bom.findById(bomId);
    const componentStatus = []
    if (!bomData) {
        console.log("error")
        return
    }
    const components = bomData.components;
    for (let i = 0; i < components.length; i++) {
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


async function checkManufacturingOrderAvailability(id: string) {
    const manufacturingOrder = await ManufacturingOrder.findById(id)

    if (!manufacturingOrder) {
        return console.log("error");
    }

    const bomId = manufacturingOrder.bom.bomId;
    const toProduce = manufacturingOrder.quantity.toProduce;

    const componentStatus = await getBOMComponentStatus(bomId, toProduce);
    manufacturingOrder.componentStatus = componentStatus;

    const updatedManuOrder = await manufacturingOrder.save();
    return updatedManuOrder;
}

export async function createManufacturingOrder(bomId: ObjectId | string, quantity: number, dueDate: Date) {
    const newManuOrderNumber = await getNewManuOrderNumber();
    const bomData: Ibom | null = await Bom.findById(bomId);
    if (!bomData) {
        console.log("error missing bomData");
        return
    }
    const productData = await Item.findById(bomData.product);
    if (!productData) {
        console.log("error missing productDate")
        return
    }
    const newManufacturingOrder = new ManufacturingOrder({
        reference: newManuOrderNumber,
        bom: {
            bomId: bomId,
            name: bomData?.name || "Unnamed"
        },
        product: {
            productId: productData?._id,
            name: productData?.name || "Unnamed",
        },
        quantity: {
            produced: 0,
            toProduce: quantity
        },
        creationDate: Date.now(),
        isDone: false,
        componentStatus: []
    });

    console.log(productData?.name)
    const createdManufacturingOrder = await newManufacturingOrder.save();
    return createdManufacturingOrder;
}

