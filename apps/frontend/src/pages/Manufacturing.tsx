import {useEffect, useState} from "react";
import axios from "axios";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Modal from "react-modal";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";


export interface ImanufacturingOrder {
    _id?: string,
    reference: number,
    product: {productId: string, name: string },
    bom: {bomId: string, name: string},
    componentStatus?: {_id: string, name?: string, required: number, status: boolean}[]
    quantity?: {produced: number, toProduce: number},
    creationDate?: Date,
    dueDate?: Date,
    doneDate?: Date,
    isDone?: boolean

}


export function Manufacturing() {
    const [manufacturingOrders, setManufacturingOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState<ImanufacturingOrder | null>()
    const [selectedOrderProduced, setSelectedOrderProduced] = useState<number>(0)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleManufacturingOrderClick = (manuOrder: ImanufacturingOrder) => {
        setSelectedOrder(manuOrder)
        setSelectedOrderProduced(manuOrder.quantity?.produced || 0)
        setIsModalOpen(true)
    }

    const fetchManufacturingOrders = async () => {
        try {
            const response = await axios.get('http://localhost:3000/manuOrder');
            setManufacturingOrders(response.data)
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleManuOrderCheck = async () => {
        const id = selectedOrder?._id
        await axios.patch(`http://localhost:3000/manuOrder/check/${id}`)
        fetchManufacturingOrders();
    }

    const handleManuOrderDelete = async () => {
        const id = selectedOrder?._id
        await axios.delete(`http://localhost:3000/manuOrder/${id}`);
        setIsModalOpen(false)
        fetchManufacturingOrders();
    }

    useEffect(() => {
        fetchManufacturingOrders()
    }, []);


    return (
        <>
        <Sheet
            className={"mx-auto mt-6 space-y-4"}
            sx={{
                maxWidth: 800,
                borderRadius: "md",
                p: 3,
                boxShadow: "lg",
            }}
        >
            <h1 className={"text-xl mb-12"}>Manufactoring</h1>
            <h1>Selected: {selectedOrder?.reference}</h1>
            <Table>
                <tr>
                    <td>#</td>
                    <td>Product</td>
                    <td>BOM</td>
                    <td>Status</td>
                    <td>Due Date</td>
                    <td>Done Date</td>
                </tr>
                {manufacturingOrders.map((manuOrder: ImanufacturingOrder) => (
                    <tr key={manuOrder._id}>
                        <td
                            className=" underline cursor-pointer select-none"
                        onClick={() => handleManufacturingOrderClick(manuOrder)}
                        >{manuOrder.reference}</td>
                        <td>{manuOrder.product.name}</td>
                        <td>{manuOrder.bom.name}</td>
                        <td>{manuOrder.isDone ? "Done" : "Not done"}</td>
                        {manuOrder?.creationDate != undefined && (
                            <td
                                className={"bg-[#616161] bg-opacity-50 border-2 border-[#616161] w-fit h-fit px-3 py-0.5 rounded text-xs select-none cursor-pointer"}>
                                {new Date(manuOrder.creationDate).toLocaleDateString()}
                            </td>
                        )}
                    </tr>
                ))
                }
            </Table>

        </Sheet>
            <div>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => handleCloseModal()}
                    className={"bg-gray-200 w-fit p-12 mx-auto h-fit rounded-2xl mt-36 space-y-6"}

                >
                    <div className={"flex space-x-2"}>
                        <h1 className={"text-2xl text-[#50A6A1]"}>Manufacturing</h1>
                        <h1 className={"text-2xl text-gray-500"}>#{selectedOrder?.reference}</h1>
                    </div>
                    <div className={"flex space-x-2"}>
                        <Button size={"sm"}>Produce all</Button>
                        <Button onClick={() => handleManuOrderCheck()} color={"neutral"} size={"sm"}>Check availability</Button>
                        <Button color={"neutral"} size={"sm"}>Unreserve</Button>
                        <Button color={"neutral"} size={"sm"}>Scrap</Button>
                        <Button onClick={() => handleManuOrderDelete()} color={"danger"} size={"sm"}>Delete</Button>
                    </div>
                    <Sheet
                        variant="outlined"
                        sx={{
                            maxWidth: 800,
                            minWidth: 800,
                            borderRadius: "md",
                            p: 6,
                            boxShadow: "lg",
                        }}>
                        <div className={"flex space-x-2 mb-4"}>
                            <h1 className={"text-[#50A6A1] my-auto"}>Quantity</h1>
                            <div className={"max-w-24"}>
                                <Input variant={"outlined"} type={"number"} size={"sm"}
                                       endDecorator={<p>/ {selectedOrder?.quantity?.toProduce}</p>}
                                       value={selectedOrderProduced}
                                       onChange={(e) => setSelectedOrderProduced(e.target.valueAsNumber)}
                                />
                            </div>
                            <h1 className={" text-gray-500 my-auto"}>To Produce</h1>
                        </div>
                        <Table borderAxis={"both"}>
                            <tr>
                                <td>BOM</td>
                                <td className={"underline select-none cursor-pointer"}>{selectedOrder?.bom.name}</td>
                            </tr>
                            <tr>
                                <td>Product</td>
                                <td className={"underline select-none cursor-pointer"}>{selectedOrder?.product.name}</td>

                            </tr>

                        </Table>

                    </Sheet>
                    <Sheet
                        variant="outlined"
                        sx={{
                            maxWidth: 800,
                            minWidth: 800,
                            borderRadius: "md",
                            p: 6,
                            boxShadow: "lg",
                        }}>
                        <Table borderAxis={"both"}>
                            <thead>
                            <tr>
                                <th>Component Name</th>
                                <th>Required Quantity</th>
                                <th>Consumed</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedOrder?.componentStatus?.map((component, index) => (
                                <tr key={index}>
                                    <td>{component.name || "Unnamed"}</td>
                                    <td>{component.required * (selectedOrder?.quantity?.toProduce || 0)}</td>
                                    <td>{component.required * (selectedOrder?.quantity?.produced || 0)}</td>
                                    <td>{component.status ? "Available" : "Not Sufficient"}</td>

                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Sheet>
                </Modal>
            </div>
        </>
    );
}