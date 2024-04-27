import {Item, Order} from "../models";

export async function getNewOrderNumber() {
    const latestOrder = await Order.findOne().sort({orderNumber: -1});
    return latestOrder ? latestOrder.orderNumber + 1 : 1
}

export async function orderMarkedAsDone(orderId: string) {
    console.log("Function called")
    const orderData = await Order.findById(orderId)
    if (!orderData) {
        console.log("Order not found")
        return
    }
    if (orderData.isDone) {
        console.log("Order is already been processed")
        return
    }
    if (!orderData.items) {
        console.log("Order doesn't contain any items")
        return
    }
    for (let index = 0; orderData.items.length >= index; index += 1) {
        const itemId = orderData.items[index]._id
        const selectedItem = await Item.findById(itemId)
        if (selectedItem) {
            console.log(selectedItem.stock)
            console.log(orderData.items[index].amount)
            if (selectedItem.stock < orderData.items[index].amount) {
                console.log("Insufficient stock for item: " + selectedItem.name)
                return
            }
            selectedItem.stock = selectedItem.stock - orderData.items[index].amount
            await selectedItem.save()
            orderData.isDone = true
            console.log(orderData.isDone)
            await orderData.save()
        } else {
            console.log("Item was not found")
        }
    }

    return orderData

}
