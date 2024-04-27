import {ObjectId} from "mongodb";
import {Ibom} from "../types";
import {Bom, Item, ManufacturingOrder} from "../models";
import {isStockSufficient, reduceStock} from "./itemService";

async function markManufacturingOrderAsDone(orderId: ObjectId): Promise<void> {
    const manuOrder = await ManufacturingOrder.findById(orderId);


    if (!manuOrder) {
        return;
    }
    manuOrder.isDone = true
    manuOrder.doneDate = new Date();
    await manuOrder.save();

}

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
                    await reduceStock(itemData, component.amount)

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
    if (0 >= toProduce) {
        return
    }
    if (orderData) {
        const bomId = orderData.bom.bomId
        for (let produced = 0; toProduce >= produced; produced++) {
            await processBom(bomId)
        }
        if ((toProduce + orderData.quantity.produced) === orderData.quantity.toProduce) {
            orderData.isDone = true
            orderData.doneDate = new Date();
            orderData.quantity.produced += toProduce
            await orderData.save()
        } else {
            orderData.quantity.produced += toProduce
            await orderData.save();
        }
    } else {
        return
    }

}

export async function getNewManuOrderNumber() {
    const latestManuOrder = await ManufacturingOrder.findOne().sort({reference: -1});
    return latestManuOrder ? latestManuOrder.reference + 1 : 1;
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
        if (component.id) {
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

    manufacturingOrder.componentStatus = await getBOMComponentStatus(bomId, toProduce);

    return await manufacturingOrder.save();
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
        dueDate: dueDate,
        isDone: false,
        componentStatus: []
    });

    console.log(productData?.name)
    return await newManufacturingOrder.save();
}
