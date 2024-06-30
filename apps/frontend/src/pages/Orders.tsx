import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import React, {useEffect, useState} from "react";
import {Iitems, Iorder} from "../types";
import Chip from "@mui/joy/Chip";
import {
    CheckBadgeIcon,
    EllipsisVerticalIcon,
    ExclamationTriangleIcon,
    PlusIcon,
    PrinterIcon,
    XMarkIcon
} from "@heroicons/react/16/solid";
import ChipDelete from "@mui/joy/ChipDelete";
import {CircularProgress, Snackbar} from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import {instance} from "../services/backend-api/axiosConfig.ts";
import {useSearchParams} from "react-router-dom";
import {AlertMessage, Ialert} from "../components/AlertMessage.tsx";


export function Orders() {
    const [orders, setOrders] = useState<Iorder[]>([])
    const [selectedOrder, setSelectedOrder] = useState<Iorder | null>(null)
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false)
    const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false)
    const [newOrderDueDate, setNewOrderDueDate] = useState<Date | null>(null)
    const [newOrderRecipient, setNewOrderRecipient] = useState("")
    const [availableItems, setAvailableItems] = useState<Iitems[]>([]);
    const [availableCustomers, setAvailableCustomers] = useState([]);
    const [isAddItemForm, setIsAddItemForm] = useState(false)
    const [errorMessage, setErrorMessage] = useState("Unknown error")
    const [isError, setIsError] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true)
    const [newItemVat, setNewItemVat] = useState(0)
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1)
    const [newItemDiscount, setNewItemDiscount] = useState(0)
    const [alert, setAlert] = useState<Ialert>({open: false, text: '', severity: "success"})
    const [newItemData, setNewItemData] = useState({
        itemId: "",
        name: "",
        amount: 0,
        salesPrice: {
            amount: 0,
            vat: 0,
            currency: ""
        }
    })
    const [updatedItemData, setUpdatedItemData] = useState({
        amount: 0,
        salesPriceAmount: 0,
        vat: 0,
        discount: 0
    })

    const handleUpdatedItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedItemData({
            ...updatedItemData,
            [e.target.name]: e.target.valueAsNumber
        })
    }

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

    const handleMessageClose = () => {
        setAlert({...alert, open: false});
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

    const handleSelectItemIndex = (index: number) => {
        setSelectedItemIndex(index)
        const itemInfo = selectedOrder?.items[index]
        setUpdatedItemData({
            amount: itemInfo?.amount || 0,
            salesPriceAmount: itemInfo?.salesPrice.amount || 0,
            vat: itemInfo?.salesPrice.vat || 0,
            discount: itemInfo?.salesPrice.discount || 0
        })
    }

    const handleAddNewItem = async (orderId: string | undefined) => {
        if (!selectedOrder) {
            handleErrorMessage(400, "Please fill in all fields")
            return;
        }

        const newItemDataToSubmit = {
            itemId: newItemData.itemId,
            name: newItemData.name,
            amount: newItemData.amount,
            salesPrice: {
                amount: newItemData.salesPrice.amount,
                vat: newItemVat,
                discount: newItemDiscount,
                currency: newItemData.salesPrice.currency
            }
        };

        try {
            await instance.post(`/orders/${orderId}/item`, newItemDataToSubmit);
            fetchOrders();
            setNewItemData(newItemData)
            setIsOrdersModalOpen(false);
            setIsAddItemForm(false)
            setNewItemVat(0)
        } catch (error) {
            console.error("Failed to add item:", error);
            handleErrorMessage(500, "Failed to add item")
        }
    };

    const handleUpdateItemData = async (itemId: string) => {
        const itemDataToUpdate = {
            amount: updatedItemData.amount,
            salesPriceAmount: updatedItemData.salesPriceAmount,
            vat: updatedItemData.vat,
            discount: updatedItemData.discount
        }
        instance.patch(`/orders/${selectedOrder?._id}/item/${itemId}`, itemDataToUpdate).then(results => {
            setAlert({
                severity: "success",
                text: results.data.message,
                open: true
            })
            fetchOrders()
            setSelectedItemIndex(-1)
        }).catch(error => {
            setAlert({
                severity: "danger",
                text: error.message.data,
                open: true
            })
        })
    }

    const handleOrderModalClose = () => {
        setSearchParams()
        setIsOrdersModalOpen(false)
    }

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
        await instance.post('/orders', orderData)

        fetchOrders()
        setIsCreationModalOpen(false)
        setNewOrderDueDate(null)
        setNewOrderRecipient("")

    }

    const handleOrderClick = (order: Iorder) => {
        setSelectedOrder(order);
        if (order._id !== undefined) {
            setSearchParams({id: order._id})
            instance.get(`/orders/orderSubtotal/${order._id}`).then(() => {
                setIsOrdersModalOpen(true)
            }).catch(error => {
                console.log(error.message)
            })
        }
    }

    const handleErrorMessage = (code: number, message: string) => {
        setIsError(true)
        setErrorMessage(`${code}: ${message}`)
    }

    const handleErrorDismiss = () => {
        setIsError(false)
        setErrorMessage("")
    }
    const handleMarkAsDone = async (orderToMark: Iorder | null) => {
        if (!orderToMark) {
            setAlert({
                severity: "danger",
                text: "Item is null",
                open: true
            })
            return;
        }
        instance.patch(`/orders/markAsDone/${orderToMark._id}`).then(results => {
            setAlert({
                severity: "success",
                text: results.data.message,
                open: true
            })

            fetchOrders()
            handleOrderClick(orderToMark)
        }).catch((error) => {
            setAlert({
                severity: "danger",
                text: error.response.data.message,
                open: true
            })
        })
    };
    const handleDelete = async (id: string | undefined) => {
        if (typeof id === 'undefined') {
            console.warn('Cannot delete an item without an id');
            handleErrorMessage(400, 'Cannot delete an item without an id')
            return;
        }
        instance.delete(`/orders/${id}`).then(results => {
            setAlert({
                severity: "warning",
                text: results.data.message,
                open: true
            })
        }).catch(error => {
            setAlert({
                    severity: "danger",
                    text: error.message,
                    open: true
                }
            )
        })
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
        instance.get('/orders').then(results => {
            setOrders(results.data)
            setLoading(false)
        }).catch(error => {
            setAlert({
                severity: "danger",
                text: error,
                open: true
            })
        })

    };

    const handleNewItemChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value)
        const newItem = availableItems.find(item => item._id === e.target.value);
        if (newItem) {
            setNewItemData({
                ...newItemData,
                itemId: e.target.value,
                name: newItem.name,
                salesPrice: {
                    amount: newItem.salePrice.amount,
                    vat: newItemVat,
                    currency: newItem.salePrice.currency
                }
            })
        }

    }

    const fetchAvailableItems = async () => {
        const response = await instance.get('/item');
        setAvailableItems(response.data);
    };

    const fetchAvailableCustomers = async () => {
        const response = await instance.get('/customer');
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

                <AlertMessage alertContent={alert} onClose={() => handleMessageClose()}/>
                {loading && (
                    <CircularProgress/>

                )}
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
                                <Button variant={"outlined"}
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
                                <td>
                                    {order.isDone ? <Chip color="success">Done!</Chip> : <Chip
                                        onClick={() => handleMarkAsDone(order || null)}
                                        endDecorator={
                                            <CheckBadgeIcon className="h-3 w-3 text-black"/>
                                        }
                                    >
                                        Not done!
                                    </Chip>
                                    }
                                </td>
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
                                <form className={"mb-4 flex flex-col justify-between w-fit"}>
                                    <div className={"flex space-x-2"}>
                                        <div className={"flex mb-4 space-x-2"}>
                                            <h2 className={"my-auto"}>Customer:</h2>
                                            <select
                                                value={newOrderRecipient}
                                                onChange={(e) => setNewOrderRecipient(e.target.value)}
                                                className="border border-gray-300 rounded-md p-2"
                                            >
                                                <option value="">Select a Customer</option>
                                                {availableCustomers.map((customer: Icustomer) => (
                                                    <option key={customer.name} value={customer.name}>
                                                        {customer.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className={"flex space-x-2 min-w-full mb-4"}>
                                        <h2 className={"my-auto text-nowrap"}>Due date:</h2>
                                        <div className={"w-48"}>
                                            <Input
                                                type="date"
                                                placeholder="Date"
                                                onChange={(e) => setNewOrderDueDate(e.target.valueAsDate)}
                                                className="px-2 border border-gray-300  w-48"
                                            />
                                        </div>
                                    </div>
                                    <div className={"space-x-2"}>
                                        <Button onClick={handleSubmitNewOrder}>Submit</Button>
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
                        onClose={() => handleOrderModalClose()}
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
                                            onClick={() => handleMarkAsDone(selectedOrder || null)}>
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
                                           '& tr > *:first-of-type': {bgcolor: 'white'},
                                           '& th[scope="col"]': {bgcolor: 'white'},
                                           '& td': {bgcolor: 'white'},
                                       }}>
                                    <thead>
                                    <tr>
                                        <th style={{width: '5%'}} scope="col">#</th>
                                        <th style={{width: '25%'}} scope="col">Name</th>
                                        <th style={{width: '10%'}} scope="col">Quantity</th>
                                        <th style={{width: '10%'}} scope="col">Vat</th>
                                        <th style={{width: '15%'}} scope="col">Unit price(DKK)</th>
                                        <th style={{width: '10%'}} scope="col">Discount</th>
                                        <th style={{width: '15%'}} scope="col">Total(DKK)</th>
                                        <th style={{width: '5%'}} scope="col"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {selectedOrder && selectedOrder.items && selectedOrder.items.length > 0 ? (
                                        selectedOrder.items.map((item, index) => (
                                            <>
                                                {selectedItemIndex === index ? (
                                                    <tr key={item._id}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.name ? (item.name) : item._id}</td>
                                                        <td><input
                                                            className="p-1 py-0 border max-w-10 border-gray-300 rounded-md"
                                                            value={updatedItemData.amount}
                                                            name={"amount"}
                                                            onChange={(e) => handleUpdatedItemChange(e)}
                                                            type={"number"}/></td>
                                                        <td><input
                                                            className="p-1 py-0 border max-w-16 border-gray-300 rounded-md"
                                                            value={updatedItemData.vat}
                                                            name={"vat"}
                                                            onChange={(e) => handleUpdatedItemChange(e)}
                                                            type={"number"}
                                                            step={0.05}
                                                            min={0}
                                                            max={1}
                                                        /></td>
                                                        <td><input
                                                            className="p-1 py-0 border max-w-16 border-gray-300 rounded-md"
                                                            value={updatedItemData.salesPriceAmount}
                                                            name={"salesPriceAmount"}
                                                            onChange={(e) => handleUpdatedItemChange(e)}
                                                            type={"number"}
                                                        /></td>
                                                        <td><input
                                                            className="p-1 py-0 border max-w-16 border-gray-300 rounded-md"
                                                            value={updatedItemData.discount}
                                                            name={"discount"}
                                                            onChange={(e) => handleUpdatedItemChange(e)}
                                                            type={"number"}
                                                        /></td>
                                                        <td>{item.salesPrice.amount * item.amount}</td>
                                                        <td className={"flex justify-between p-0"}>
                                                            <a className={"bg-green-500 text-black text-opacity-40 rounded-bl rounded-tl w-1/2 p-1 select-none hover:cursor-pointer"} onClick={() => handleUpdateItemData(item._id || "")}>Y</a>
                                                            <a className={"bg-red-500 text-black text-opacity-40 rounded-br rounded-tr w-1/2 p-1 select-none hover:cursor-pointer"} onClick={() => setSelectedItemIndex(-1)}>X</a>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    <tr key={item._id}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.name ? (item.name) : item._id}</td>
                                                        <td>{item.amount}</td>
                                                        <td>{item.salesPrice.vat || 0}</td>
                                                        <td>{item.salesPrice?.amount}</td>
                                                        <td>{item.salesPrice.discount || 0} kr.</td>
                                                        <td>{item.salesPrice.amount * item.amount}</td>
                                                        <td><EllipsisVerticalIcon
                                                            onClick={() => handleSelectItemIndex(index)}
                                                            className={"w-6 h-6 text-gray-500"}/></td>
                                                    </tr>
                                                )}
                                            </>


                                        ))

                                    ) : (
                                        <tr>
                                            <td>No items</td>
                                        </tr>
                                    )}


                                    {isAddItemForm && (

                                        <tr>
                                            <td>{selectedOrder?.items && selectedOrder.items.length + 1}</td>
                                            <td className="">
                                                <select
                                                    value={newItemData.itemId}

                                                    onChange={(e) => handleNewItemChange(e)}
                                                    className="border p-2 pl-1 border-gray-300 rounded-md"
                                                >
                                                    <option value="">Select a Component</option>
                                                    {availableItems.map((item: Iitems) => (
                                                        <option key={item._id} value={item._id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="p-1 py-2 border max-w-16 border-gray-300 rounded-md"
                                                    name={"amount"}
                                                    value={newItemData.amount}
                                                    onChange={(e) => setNewItemData({
                                                        ...newItemData,
                                                        amount: e.target.valueAsNumber
                                                    })}
                                                />
                                            </td>
                                            <td>
                                                <input type={"number"} value={newItemVat}
                                                       step={0.05}
                                                       max={1}
                                                       className="p-1 py-2 border max-w-16 border-gray-300 rounded-md"


                                                       onChange={(e) => setNewItemVat(e.target.valueAsNumber)}/>
                                            </td>
                                            <td>{newItemData.salesPrice.amount}</td>
                                            <td><input type={"number"} value={newItemDiscount}
                                                       className="p-1 py-2 border max-w-16 border-gray-300 rounded-md"
                                                       onChange={(e) => setNewItemDiscount(e.target.valueAsNumber)}/>
                                            </td>
                                            <td>
                                                {newItemData.salesPrice.amount * newItemData.amount}
                                            </td>
                                            <td>
                                                <Button
                                                    onClick={() => handleAddNewItem(selectedOrder?._id)}>Add</Button>
                                                <Button variant={"plain"}
                                                        onClick={() => setIsAddItemForm(false)}>X</Button>
                                            </td>

                                        </tr>

                                    )}

                                    </tbody>
                                </Table>
                                <div className={"w-[30%] ml-auto"}>
                                    <Table borderAxis={"none"}>
                                        <tbody className={"space-y-2"}>
                                        <tr>
                                            <td>Subtotal</td>
                                            <td style={{
                                                width: '25%',
                                                textAlign: "right"
                                            }}>{selectedOrder?.subTotal?.amount + " kr."}</td>
                                        </tr>
                                        <tr>
                                            <td>Discount</td>
                                            <td style={{
                                                width: '20%',
                                                textAlign: "right"
                                            }}>{selectedOrder?.subTotal?.discount}</td>
                                        </tr>
                                        <tr>
                                            <td>Vat</td>
                                            <td style={{width: '20%', textAlign: "right"}}>{selectedOrder?.subTotal?.vat} kr.</td>
                                        </tr>
                                        <tr className={"font-bold"}>
                                            <td>Total</td>
                                            <td style={{
                                                width: '20%',
                                                textAlign: "right"
                                            }}>{selectedOrder?.subTotal?.total} kr.
                                            </td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </div>
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
