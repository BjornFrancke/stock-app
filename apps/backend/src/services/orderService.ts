import {Item, Order} from "../models";
import {Iorder} from "../types";
import {isStockSufficient} from "./itemService";

export async function getNewOrderNumber() {
    const latestOrder = await Order.findOne().sort({orderNumber: -1});
    return latestOrder ? latestOrder.orderNumber + 1 : 1
}


async function getOrderLineDiscount(orderData: Iorder) {

    if (!orderData) {
        throw new Error("order data doesn't exist");
    }
    console.log(orderData.items.length)
    let totalDiscount = 0;
    for (let index = 0; index < orderData.items.length; index++) {
        if (!orderData.items[index].salesPrice.discount) {
            return
        } else {
            console.log("before" + totalDiscount);
            totalDiscount = totalDiscount + (orderData.items[index].salesPrice.discount * orderData.items[index].amount);
            console.log("after" + totalDiscount);
        }
    }
    return totalDiscount;
}


async function getOrderVatTotal(orderData: Iorder) {
    if (!orderData) {
        throw new Error("order data doesn't exist");
    }
    let totalVat = 0

    for (let index = 0; index < orderData.items.length; index++) {
        const itemData = orderData.items[index];
        if (itemData.salesPrice.vat) {
            totalVat = totalVat + ((itemData.salesPrice.vat * itemData.salesPrice.amount) * itemData.amount);
        }
    }
    return totalVat
}

export async function getOrderSubTotal(orderId: string) {
    if (!orderId) {
        return
    }
    console.log("function runned")
    const orderData = await Order.findById(orderId)
    if (orderData && orderData.items.length > 0) {
        console.log("yes")
        orderData.subTotal = {amount: 0, currency: "", vat: 0}
        let subTotalAmount = 0
        for (let index = 0; orderData.items.length > index; index++) {
            const itemData = orderData.items[index]
            console.log(itemData.salesPrice.amount)
            subTotalAmount += (itemData.salesPrice.amount * itemData.amount)
            console.log(subTotalAmount)
        }
        const totalDiscount = await getOrderLineDiscount(orderData)
        const totalVat = await getOrderVatTotal(orderData)
        orderData.subTotal.discount = totalDiscount
        orderData.subTotal.amount = subTotalAmount
        orderData.subTotal.vat = totalVat
        if (totalDiscount) {
            orderData.subTotal.total = subTotalAmount - totalDiscount
        }
        if (totalVat) {
            orderData.subTotal.total = subTotalAmount + totalVat
        } else {
            orderData.subTotal.total = subTotalAmount
        }
        await orderData.save()
        return subTotalAmount
    }

}


export async function canOrderBeMarkedAsDone(orderData: Iorder): Promise<boolean> {
    if (!orderData) {
        return false
    }
    for (let index = 0; orderData.items.length > index; index++) {
        const itemId = orderData.items[index]._id
        const selectedItem = await Item.findById(itemId)
        if (selectedItem) {
            console.log(selectedItem.name)
            console.log(selectedItem.stock)
            console.log(orderData.items[index].amount)
            if (!(await isStockSufficient(selectedItem, orderData.items[index].amount))) {
                return false
            }
        }
    }
    return true

}

export async function orderMarkedAsDone(orderId: string): Promise<{ statusCode: number, message: string }> {
    const orderData = await Order.findById(orderId)
    if (!orderData) {
        return {statusCode: 404, message: "Order not found"};
    }
    if (orderData.isDone) {
        return {statusCode: 404, message: "Order is already processed"};
    }
    if (!orderData.items) {
        return {statusCode: 404, message: "Order doesn't contain any items!"};
    }
    if (!(await canOrderBeMarkedAsDone(orderData))) {
        console.log("canOrderBeMarkedAsDone = false")
        return {statusCode: 404, message: "Stock is not sufficient"};
    }

    orderData.isDone = true
    orderData.save()
    return {statusCode: 200, message: "Success"}

}
