import {useEffect, useState} from "react";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Modal from "react-modal";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Chip from "@mui/joy/Chip";
import {BellAlertIcon, CalendarDaysIcon} from "@heroicons/react/16/solid";
import {instance} from "../services/backend-api/axiosConfig.ts";
import {useNavigate, useSearchParams} from "react-router-dom";
import {ProduceBtn} from "../components/manufacturing/ProduceBtn.tsx";
import {CircularProgress} from "@mui/joy";
import {ManufacturingCreationModal} from "../components/manufacturing/ManufacturingCreationModal.tsx";


export interface ImanufacturingOrder {
    _id?: string,
    reference: number,
    product: { productId: string, name: string },
    bom: { bomId: string, name: string },
    componentStatus?: { _id: string, name?: string, required: number, status: boolean }[]
    quantity?: { produced: number, toProduce: number },
    creationDate?: Date,
    dueDate?: Date,
    doneDate?: Date,
    isDone?: boolean

}


export function Manufacturing() {
    const [manufacturingOrders, setManufacturingOrders] = useState<ImanufacturingOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<ImanufacturingOrder | null>()
    const [selectedOrderProduced, setSelectedOrderProduced] = useState<number>(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams();
    const [produceState, setProduceState] = useState<"ready" | "producing" | "completed">("ready")
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const handleManufacturingOrderClick = (manuOrder: ImanufacturingOrder) => {
        setSelectedOrder(manuOrder)
        setSelectedOrderProduced(manuOrder.quantity?.produced || 0)
        if (manuOrder._id !== undefined) {
            setSearchParams({id: manuOrder._id})
        }
        if (manuOrder.isDone) {
            setProduceState("completed")
        } else {
            setProduceState("ready")
        }
        setIsModalOpen(true)
    }

    const handleSearchParams = () => {
        if (searchParams) {
            const search = searchParams.get("id")
            if (search && manufacturingOrders.length > 0) {
                const bom = manufacturingOrders.find(manufacturingOrders => manufacturingOrders._id === search)
                if (bom) {
                    handleManufacturingOrderClick(bom)

                }
            }
        }
    }

    const handleOpenCreationModal = async () => {
        setIsCreationModalOpen(true)
    }

    const handleCloseCreationModal = async () => {
        await fetchManufacturingOrders()
        setIsCreationModalOpen(false)
    }

    const fetchManufacturingOrders = async () => {
        instance.get('/manuOrder').then(response => {
            setManufacturingOrders(response.data)
            setLoading(false)
        }).catch(error => {
            console.error(error)
        })


    }

    const handleCloseModal = () => {
        setSearchParams()
        setIsModalOpen(false);
    }


    const handleManuOrderProduce = async () => {
        const bomId = selectedOrder?._id
        const toProduce = (selectedOrderProduced - (selectedOrder?.quantity?.produced || 0))
        const reqData = {
            produce: toProduce
        }
        setProduceState("producing")
        instance.patch(`/manuOrder/${bomId}`, reqData).then(response => {
            fetchManufacturingOrders()
            if (selectedOrder?.isDone) {
                setProduceState("completed")
            } else {
                setProduceState("ready")
            }
            console.log(response.data.message)
        }).catch(error => console.log(error))
    }

    const handleManuOrderCheck = async () => {
        const id = selectedOrder?._id
        await instance.patch(`/manuOrder/check/${id}`)
        await fetchManufacturingOrders();
    }

    const handleManuOrderDelete = async () => {
        const id = selectedOrder?._id
        await instance.delete(`/manuOrder/${id}`);
        setIsModalOpen(false)
        await fetchManufacturingOrders();
    }

    useEffect(() => {
        fetchManufacturingOrders()
    }, []);

    useEffect(() => {
        handleSearchParams()
    }, [manufacturingOrders]);


    function handleNavigateToProduct(productId: string) {
        console.log(productId)
        navigate(`/item/${productId}`)
    }
    function handleNavigateToBom(bomId: string) {
        console.log(bomId)
        navigate(`/bom/${bomId}`)
    }

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
                <h1 className={"text-xl mb-12"}>Manufacturing</h1>
                {loading && (
                    <CircularProgress/>
                )}
                <Table borderAxis={"both"}>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>BOM</th>
                        <th>Status</th>
                        <th><Button onClick={() => handleOpenCreationModal()}>Create</Button></th>
                    </tr>
                    </thead>
                    <tbody>
                    {manufacturingOrders.map((manuOrder: ImanufacturingOrder) => (
                        <tr key={manuOrder._id}>
                            <td
                                className="underline cursor-pointer select-none"
                                onClick={() => handleManufacturingOrderClick(manuOrder)}
                            >{manuOrder.reference}</td>
                            <td>{manuOrder.product.name}</td>
                            <td>{manuOrder.bom.name}</td>
                            <td>{manuOrder.isDone ? <Chip color={"success"}>Done</Chip> : <Chip>Pending</Chip>}</td>
                            {manuOrder?.dueDate != undefined && !isModalOpen && !isCreationModalOpen && (
                                <td>
                                    {
                                        (new Date(manuOrder.dueDate).valueOf()) < Date.now() && !isModalOpen ?
                                            <Chip color={"danger"} endDecorator={<BellAlertIcon
                                                className={"h-3 w-3 text-red-400"}/>}>{new Date(manuOrder.dueDate).toLocaleDateString()}</Chip> :
                                            <Chip color={"success"} endDecorator={<CalendarDaysIcon
                                                className={"h-3 w-3 text-green-300"}/>}>{new Date(manuOrder.dueDate).toLocaleDateString()}</Chip>
                                    }
                                </td>
                            )}

                        </tr>
                    ))
                    }
                    </tbody>
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
                        <ProduceBtn produceState={produceState} onClick={() => handleManuOrderProduce()}/>
                        <Button onClick={() => handleManuOrderCheck()} color={"neutral"} size={"sm"}>Check
                            availability</Button>
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
                                {selectedOrder?.isDone ?
                                    <Input variant={"outlined"} disabled type={"number"} size={"sm"}
                                           endDecorator={<p>/ {selectedOrder?.quantity?.toProduce}</p>}
                                           value={selectedOrderProduced}
                                           onChange={(e) => setSelectedOrderProduced(e.target.valueAsNumber)}
                                    /> : <Input variant={"outlined"} type={"number"} size={"sm"}
                                                endDecorator={<p>/ {selectedOrder?.quantity?.toProduce}</p>}
                                                value={selectedOrderProduced}
                                                onChange={(e) => setSelectedOrderProduced(e.target.valueAsNumber)}
                                    />}

                            </div>
                            <h1 className={" text-gray-500 my-auto"}>To Produce</h1>
                        </div>
                        <Table borderAxis={"x"}>
                            <tbody>
                            <tr>
                                <td>BOM</td>
                                <td onClick={() => handleNavigateToBom(selectedOrder?.bom.bomId || "")} className={"underline select-none cursor-pointer"}>{selectedOrder?.bom.name}</td>
                            </tr>
                            <tr>
                                <td>Product</td>
                                <td onClick={() => handleNavigateToProduct(selectedOrder?.product.productId || "")}
                                    className={"underline select-none cursor-pointer"}>{selectedOrder?.product.name}</td>

                            </tr>
                            </tbody>
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
                <Modal
                    isOpen={isCreationModalOpen}
                    onRequestClose={() => setIsCreationModalOpen(false)}
                    className={"bg-gray-200 w-fit p-12 mx-auto h-fit rounded-2xl mt-36 space-y-6"}

                >
                    <ManufacturingCreationModal isOpen={() => handleCloseCreationModal()}/>
                </Modal>
            </div>
        </>
    );
}
