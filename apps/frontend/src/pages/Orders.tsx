import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import {useEffect, useState} from "react";
import {Iitems, Iorder} from "../types";
import Chip from "@mui/joy/Chip";
import {
    CheckBadgeIcon, EllipsisVerticalIcon,
    ExclamationTriangleIcon,
    PlusIcon,
    PrinterIcon,
    XMarkIcon
} from "@heroicons/react/16/solid";
import ChipDelete from "@mui/joy/ChipDelete";
import {Snackbar} from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import {instance} from "../services/backend-api/axiosConfig.ts";
import {useSearchParams} from "react-router-dom";


export function Orders() {
    const [orders, setOrders] = useState<Iorder[]>([])
    const [selectedOrder, setSelectedOrder] = useState<Iorder | null>(null)
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false)
    const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false)
    const [newOrderDueDate, setNewOrderDueDate] = useState<Date | null>(null)
    const [newOrderRecipient, setNewOrderRecipient] = useState("")
    const [newItemToAddAmount, setNewItemToAddAmount] = useState(0)
    const [newItemToAddId, setNewItemToAddId] = useState("")
    const [availableItems, setAvailableItems] = useState([]); // State for available components
    const [availableCustomers, setAvailableCustomers] = useState([]);
    const [isAddItemForm, setIsAddItemForm] = useState(false)
    const [errorMessage, setErrorMessage] = useState("Unknown error")
    const [isError, setIsError] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams();

    interface Iaddress {
        street: string,
        zip: number,
        city: string,
        country: string
    }

    interface Icustomer {
        _id?: string,
        name: string,
        mailAdress: string,
        phoneNr?: string,
        address: Iaddress
    }

    const handleSearchParams = () => {
        if (searchParams) {
            const search = searchParams.get("id")
            if (search && orders.length > 0) {
                const order = orders.find(orders => orders._id === search)
                if (order) {
                    handleOrderClick(order)

                }
            }
        }
    }

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
            await instance.patch(`/orders/${orderId}/additem`, newItemData);
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
        await instance.post('/orders/create', orderData)

        fetchOrders()
        setIsCreationModalOpen(false)
        setNewOrderDueDate(null)
        setNewOrderRecipient("")

    }

    const handleOrderClick = (order: Iorder) => {
        setSelectedOrder(order);
        if (order._id !== undefined) {
            setSearchParams({id: order._id})
        }
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
        await instance.patch(`/orders/markAsDone/${id}`);
        await fetchOrders();
    };
    const handleDelete = async (id: string | undefined) => {
        if (typeof id === 'undefined') {
            console.warn('Cannot delete an item without an id');
            handleErrorMessage(400, 'Cannot delete an item without an id')
            return;
        }
        await instance.delete(`/orders/delete/${id}`);
        fetchOrders();
    };

    useEffect(() => {
        fetchOrders();
        fetchAvailableItems()
        fetchAvailableCustomers()
    }, []);


    useEffect(() => {
        handleSearchParams();
    }, [orders]);

    const fetchOrders = async () => {
        const response = await instance.get('/orders/findAll');
        setOrders(response.data);

    };

    const fetchAvailableItems = async () => {
        const response = await instance.get('/item/findAll');
        setAvailableItems(response.data);
    };

    const fetchAvailableCustomers = async () => {
        const response = await instance.get('/customer/findAll');
        setAvailableCustomers(response.data);
    };


    return (
        <>
            <Sheet
                className={"mx-auto mt-6"}
                sx={{
                    maxWidth: 800,
                    borderRadius: "md",
                    p: 3,
                    boxShadow: "lg",
                }}
            >


                <h1 className="text-xl">Orders</h1>
                <div className="flex w-full justify-center mt-12">

                    <Table borderAxis="both" className={""}>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Customer</th>
                            <th>Due date</th>
                            <th>Status</th>
                            <th>
                                <Button variant={"outlined"} sx={{color: "#50A6A1"}}
                                        onClick={() => setIsCreationModalOpen(true)}>
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
                                maxWidth: 800,
                                minWidth: 800,
                                minHeight: 400,
                                borderRadius: "md",
                                p: 6,
                                boxShadow: "lg",
                            }}
                        >
                            <div className={"w-48 space-y-8"}>
                                <h1 className={"text-[#50A6A1] text-xl"}>New order</h1>
                            <form className={"space-y-4 flex flex-col justify-between"}>
                                <div className={"flex space-x-2"}>
                                    <h2 className={"my-auto"}>Customer:</h2>
                                <select
                                    value={newOrderRecipient}
                                    onChange={(e) => setNewOrderRecipient(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md min-w-full"
                                >
                                    <option value="">Select a Customer</option>
                                    {availableCustomers.map((customer: Icustomer) => (
                                        <option key={customer.name} value={customer.name}>
                                            {customer.name}
                                        </option>
                                    ))}
                                </select>
                                </div>
                                <div className={"flex space-x-2 min-w-full"}>
                                    <h2 className={"my-auto text-nowrap"}>Due date:</h2>
                                    <div className={"min-w-full"}>
                                <Input
                                    type="date"
                                    placeholder="Date"
                                    onChange={(e) => setNewOrderDueDate(e.target.valueAsDate)}
                                />
                                    </div>
                                </div>

                                {newOrderDueDate != null && (
                                    <h2>{newOrderDueDate.getTime() / 1000}</h2>
                                )}
                                <div className={"space-x-2"}>
                                <Button variant={"outlined"} sx={{color: "#50A6A1"}} onClick={handleSubmitNewOrder}>Submit</Button>
                                <Button
                                    onClick={() => setIsCreationModalOpen(false)}
                                    color="danger"
                                    variant="outlined"
                                >
                                    Cancel
                                </Button>
                                </div>
                            </form>
                            </div>
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
                            className="space-y-10 bg-[#D7D7D7]"
                            sx={{
                                width: "80%",
                                borderRadius: "sm",
                                p: 3,
                                boxShadow: "lg",
                                backgroundColor: "rgba(215, 215, 215, 0.85)",
                            }
                            }
                        >
                            <div className={"flex justify-between"}>
                                <div className={"flex space-x-2"}>
                                    <h1 className={"text-[#50A6A1] text-2xl"}>Order</h1>
                                    <h1 className={"text-2xl text-gray-500"}>#{selectedOrder?.orderNumber}</h1>
                                </div>
                                <div className={"flex"}>
                                    <XMarkIcon className={"h-6 w-6 text-gray-500"}/>

                                </div>
                            </div>


                            <div>
                                <div className={"w-full min-h-6 space-x-4"}>
                                    <a className={"underline decoration-[#50A6A1] underline-offset-[6px] decoration-2"}>Information</a>
                                    <a>Notes</a>
                                </div>
                                <div className={"w-full bg-black"}></div>
                                <div className={"w-[90px] h-[2px]"}></div>

                            </div>

                            <div
                                className={"bg-[#FEFEFE] w-full min-h-36 p-3 px-9 py-5 rounded shadow justify-between flex flex-col"}>
                                <div>
                                    Customer
                                    <h2 className={"text-[#50A6A1]"}>{selectedOrder?.receptian
                                    }</h2>
                                </div>
                                <div className={"flex space-x-1"}>
                                    {selectedOrder?.isDone && (
                                        <div
                                            className={"bg-[#78F585] bg-opacity-50 border-2 border-[#78F585] w-fit h-fit px-3 py-0.5 rounded text-xs select-none cursor-not-allowed"}>
                                            Sent
                                        </div>
                                    )}
                                    {!selectedOrder?.isDone && (
                                        <div
                                            className={"bg-[#616161] bg-opacity-50 border-2 border-[#616161] w-fit h-fit px-3 py-0.5 rounded text-xs select-none cursor-pointer"}
                                            onClick={() => handleMarkAsDone(selectedOrder?._id)}>
                                            Not Sent
                                        </div>
                                    )}

                                    <div
                                        className={"bg-[#616161] bg-opacity-50 border-2 border-[#616161] w-fit h-fit px-3 py-0.5 rounded text-xs select-none cursor-pointer"}>
                                        Not invoiced
                                    </div>
                                    {selectedOrder?.dueDate != undefined && (
                                        <div
                                            className={"bg-[#616161] bg-opacity-50 border-2 border-[#616161] w-fit h-fit px-3 py-0.5 rounded text-xs select-none cursor-pointer"}>
                                            Due: {new Date(selectedOrder.dueDate).toLocaleDateString()}
                                        </div>
                                    )}


                                </div>

                            </div>
                            <div
                                className={"bg-[#FEFEFE] w-full min-h-[500px] p-3 px-9 py-5 rounded shadow flex flex-col space-y-3"}>
                                <div className={"flex space-x-1"}>
                                    <h1>Lines</h1>

                                    {!isAddItemForm && (
                                        <div
                                            className={"border-2 border-[#50A6A1] w-fit h-fit px-1.5 py-0.5 rounded text-xs flex space-x-1 select-none cursor-pointer"}
                                            onClick={() => setIsAddItemForm(true)}
                                        >
                                            <PlusIcon className={"w-4 h-4 text-gray-500"}/>
                                            Product

                                        </div>

                                    )}
                                    <div
                                        className={"border-2 border-[#50A6A1] w-fit h-fit px-1.5 py-0.5 rounded text-xs flex space-x-1 select-none cursor-pointer"}>
                                        <PrinterIcon className={"w-auto h-4 text-gray-500"}/>
                                        Print
                                    </div>
                                </div>
                                <Table borderAxis={"both"}
                                       sx={{
                                           bgcolor: "white",
                                           '& tr > *:first-child': {bgcolor: 'white'},
                                           '& th[scope="col"]': {bgcolor: 'white'},
                                           '& td': {bgcolor: 'white'},
                                       }}>
                                    <thead>
                                    <tr>
                                        <th style={{width: '10%'}} scope="col">#</th>
                                        <th style={{width: '30%'}} scope="col">ID</th>
                                        <th style={{width: '15%'}} scope="col">Quantity</th>
                                        <th style={{width: '20%'}} scope="col">Unit price(DKK)</th>
                                        <th style={{width: '20%'}} scope="col">Total(DKK)</th>
                                        <th style={{width: '5%'}} scope="col"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {selectedOrder && selectedOrder.items && selectedOrder.items.length > 0 ? (
                                        selectedOrder.items.map((item, index) => (
                                            <tr key={item._id}>
                                                <td>{index + 1}</td>
                                                <td>{item._id} </td>
                                                <td>{item.amount}</td>
                                                <td>0</td>
                                                <td>0</td>
                                                <td><EllipsisVerticalIcon className={"w-6 h-6 text-gray-500"}/></td>
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
                                                    <Button
                                                        onClick={() => handleAddNewItem(selectedOrder?._id)}>Add</Button>
                                                    <Button variant={"plain"}
                                                            onClick={() => setIsAddItemForm(false)}>X</Button>

                                                </form>
                                            </td>

                                        )}
                                    </tr>
                                    </tbody>
                                </Table>
                            </div>


                        </Sheet>
                    </Modal>


                </div>
                <Snackbar
                    open={isError}
                    color={"danger"}
                    variant={"solid"}
                    startDecorator={<ExclamationTriangleIcon className={"h-6 w-6 text-white"}/>}
                    endDecorator={<IconButton variant={"solid"} color={"danger"} onClick={handleErrorDismiss}><XMarkIcon
                        className={"h-6 w-6 text-white"}/></IconButton>}
                >
                    {errorMessage}
                </Snackbar>
            </Sheet>
        </>
    );
}