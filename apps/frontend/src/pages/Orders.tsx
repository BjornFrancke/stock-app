import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import axios from "axios";
import {useEffect, useState} from "react";
import {Iitems, Iorder} from "../types";
import Chip from "@mui/joy/Chip";
import {CheckBadgeIcon, ExclamationTriangleIcon, XMarkIcon} from "@heroicons/react/16/solid";
import ChipDelete from "@mui/joy/ChipDelete";
import {Snackbar} from "@mui/joy";
import IconButton from "@mui/joy/IconButton";

export function Orders() {
    const [orders, setOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState<Iorder | null>(null)
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false)
    const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false)
    const [newOrderDueDate, setNewOrderDueDate] = useState<Date | null>(null)
    const [newOrderRecipient, setNewOrderRecipient] = useState("")
    const [newItemToAddAmount, setNewItemToAddAmount] = useState(0)
    const [newItemToAddId, setNewItemToAddId] = useState("")
    const [availableItems, setAvailableItems] = useState([]); // State for available components
    const [isAddItemForm, setIsAddItemForm] = useState(false)
    const [errorMessage, setErrorMessage] = useState("Unknown error")
    const [isError, setIsError] = useState(false)


    const handleAddNewItem = async (orderId: string | undefined) => {
        if (!selectedOrder || !newItemToAddAmount) {
            handleErrorMessage(400, "Please fill in all fields")
            return;
        }

        const newItemData = {
            itemId: newItemToAddId,
            amount: newItemToAddAmount
        };

        try {
            await axios.patch(`http://localhost:3000/orders/${orderId}/additem`, newItemData);
            fetchOrders();
            setNewItemToAddAmount(0);
            setNewItemToAddId("")
            setIsOrdersModalOpen(false);
            setIsAddItemForm(false)
        } catch (error) {
            console.error("Failed to add item:", error);
            handleErrorMessage(500, "Failed to add item")
        }
    };

    const handleSubmitNewOrder = async () => {
        const orderData = {
            orderNumber: 3,
            receptian: newOrderRecipient,
            dueDate: newOrderDueDate

        }
        if (orderData.receptian === "" || !orderData.dueDate) {
            handleErrorMessage(400, "Please fill in all fields")
            return
        }
        await axios.post('http://localhost:3000/orders/create', orderData)

        fetchOrders()
        setIsCreationModalOpen(false)
        setNewOrderDueDate(null)
        setNewOrderRecipient("")

    }

    const handleOrderClick = (order: Iorder) => {
        setSelectedOrder(order);
        setIsOrdersModalOpen(true)
    }

    const handleErrorMessage = (code: number, message: string) => {
        setIsError(true)
        setErrorMessage(`${code}: ${message}`)
    }

    const handleErrorDismiss = () => {
        setIsError(false)
        setErrorMessage("")
    }
    const handleMarkAsDone = async (id: string | undefined) => {
        if (typeof id === 'undefined') {
            console.warn('ID is undefined');
            handleErrorMessage(400, 'ID is undefined')
            return;
        }
        const response = await axios.patch(`http://localhost:3000/orders/markAsDone/${id}`);
        if (response.status != 200) {
            handleErrorMessage(Number(response.status), response.statusText)
            return
        }
        await fetchOrders();
    };
    const handleDelete = async (id: string | undefined) => {
        if (typeof id === 'undefined') {
            console.warn('Cannot delete an item without an id');
            handleErrorMessage(400, 'Cannot delete an item without an id')
            return;
        }
        await axios.delete(`http://localhost:3000/orders/delete/${id}`);
        fetchOrders();
    };

    useEffect(() => {
        fetchOrders();
        fetchAvailableItems()
    }, []);

    const fetchOrders = async () => {
        const response = await axios.get('http://localhost:3000/orders/findAll');
        setOrders(response.data);

    };

    const fetchAvailableItems = async () => {
        const response = await axios.get('http://localhost:3000/item/findAll');
        setAvailableItems(response.data);
    };


    return (
        <>
            <h1 className="text-center mt-6">Orders</h1>
            <div className="flex w-screen justify-center mt-12">

                <Table borderAxis="both" className={"max-w-[50%]"}>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Recipient</th>
                        <th>Due date</th>
                        <th>Status</th>
                        <th>
                            <Button onClick={() => setIsCreationModalOpen(true)}>
                                Add Order
                            </Button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order: Iorder) => (
                        <tr key={order._id}>
                            <td className=" underline cursor-pointer select-none"
                                onClick={() => handleOrderClick(order)}>
                                {order.orderNumber}
                            </td>
                            <td>{order.receptian}</td>
                            <td>{new Date(order.dueDate).toLocaleDateString()}</td>
                            {order.isDone && (
                                <td>
                                    <Chip color="success">Done!</Chip>
                                </td>
                            )}
                            {!order.isDone && (
                                <td>
                                    <Chip
                                        onClick={() => handleMarkAsDone(order._id)}
                                        endDecorator={
                                            <CheckBadgeIcon className="h-3 w-3 text-black"/>
                                        }
                                    >
                                        Not done!
                                    </Chip>
                                </td>
                            )}
                            {order.isDone === null && <td>Null</td>}
                            <td>
                                {" "}
                                <Chip
                                    variant="soft"
                                    color="danger"
                                    size="sm"
                                    className={"select-none"}
                                    endDecorator={
                                        <ChipDelete onClick={() => handleDelete(order._id)}/>
                                    }
                                >
                                    Delete
                                </Chip>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <Modal
                    aria-labelledby="modal-title"
                    aria-describedby="modal-desc"
                    open={isCreationModalOpen}
                    onClose={() => setIsCreationModalOpen(false)}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Sheet
                        variant="outlined"
                        sx={{
                            maxWidth: 500,
                            borderRadius: "md",
                            p: 3,
                            boxShadow: "lg",
                        }}
                    >
                        <form>
                            <Input
                                type="text"
                                placeholder="Recipient"
                                value={newOrderRecipient}
                                onChange={(e) => setNewOrderRecipient(e.target.value)}
                            />
                            <Input
                                type="date"
                                placeholder="Date"
                                onChange={(e) => setNewOrderDueDate(e.target.valueAsDate)}
                            />
                            {newOrderDueDate != null && (
                                <h2>{newOrderDueDate.getTime() / 1000}</h2>
                            )}
                            <Button onClick={handleSubmitNewOrder}>Submit</Button>
                            <Button
                                onClick={() => setIsCreationModalOpen(false)}
                                color="danger"
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                        </form>
                    </Sheet>
                </Modal>
                <Modal
                    aria-labelledby="modal-title"
                    aria-describedby="modal-desc"
                    open={isOrdersModalOpen}
                    onClose={() => setIsOrdersModalOpen(false)}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Sheet
                        variant="outlined"
                        className="space-y-10"
                        sx={{
                            maxWidth: 750,
                            borderRadius: "md",
                            p: 3,
                            boxShadow: "lg",

                        }
                        }
                    >
                        <Table>
                            <tr>
                                <td>#</td>
                                <td>{selectedOrder?.orderNumber}</td>
                            </tr>
                            <tr>
                                <td>ID</td>
                                <td>{selectedOrder?._id}</td>
                            </tr>
                            <tr>
                                <td>Recipient</td>
                                <td>{selectedOrder?.receptian}</td>
                            </tr>
                        </Table>
                        <Table>
                            <caption className={"text-left"}>Items</caption>
                            <thead>
                            <tr>
                            <th>#</th>
                                <th>ID</th>
                                <th>Amount</th>


                            </tr>
                            </thead>

                            <tbody>
                            {selectedOrder && selectedOrder.items && selectedOrder.items.length > 0 ? (
                                selectedOrder.items.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{index + 1}</td>
                                        <td>{item._id} </td>
                                        <td>{item.amount}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td>No items</td>
                                </tr>
                            )}

                            <tr>
                                {isAddItemForm && (
                                    <td className="flex">
                                        <form className="flex space-x-2">
                                            <select
                                                value={newItemToAddId}
                                                onChange={(e) => setNewItemToAddId(e.target.value)}
                                                className="pl-1 border border-gray-300 rounded-md"
                                            >
                                                <option value="">Select a Component</option>
                                                {availableItems.map((item: Iitems) => (
                                                    <option key={item._id} value={item._id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                className="pl-1 border max-w-16 border-gray-300 rounded-md"
                                                value={newItemToAddAmount}
                                                onChange={(e) => setNewItemToAddAmount(e.target.valueAsNumber)}
                                            />
                                            <Button onClick={() => handleAddNewItem(selectedOrder?._id)}>Add</Button>
                                            <Button variant={"plain"} onClick={() => setIsAddItemForm(false)}>X</Button>

                                        </form>
                                    </td>

                                )}
                            </tr>
                            <tr>
                                <td>               {!isAddItemForm && (
                                    <td><Button onClick={() => setIsAddItemForm(true)}>Add</Button></td>

                                )}
                                </td>
                            </tr>
                            </tbody>
                        </Table>
                    </Sheet>
                </Modal>
            </div>
            <Snackbar
                    open={isError}
                    color={"danger"}
                    variant={"solid"}
                    startDecorator={<ExclamationTriangleIcon className={"h-6 w-6 text-white"}/>}
                    endDecorator={<IconButton variant={"solid"} color={"danger"} onClick={handleErrorDismiss}><XMarkIcon className={"h-6 w-6 text-white"}/></IconButton>}
                >
                    {errorMessage}
                </Snackbar>
        </>
    );
}