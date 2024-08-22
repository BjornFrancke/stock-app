import {Iitems} from "../../types.ts";
import {Link} from "react-router-dom";
import {ArrowsPointingOutIcon, PencilSquareIcon} from "@heroicons/react/16/solid";
import Table from "@mui/joy/Table";
import Chip from "@mui/joy/Chip";
import {Input} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useEffect, useState} from "react";
import {instance} from "../../services/backend-api/axiosConfig.ts";
import {Ialert} from "../AlertMessage.tsx";
import Modal from "react-modal";
import {BodySheet} from "../BodySheet.tsx";


export const SelectedItemModal = (props: {
    item: Iitems | null
    open: boolean,
    handleAlert: ({open, text, severity}: Ialert) => void,
    onRequestClose: () => void,
}) => {
    const {item, handleAlert} = props;
    const [newItemDescription, setNewItemDescription] = useState<string | null>(null);
    const [newPrice, setNewPrice] = useState(-1)
    const [newStockValue, setNewStockValue] = useState(0)
    const [showChangeStockForm, setShowChangeStockForm] = useState(false)

    useEffect(() => {
        if (item?.stock) {
            setNewStockValue(item.stock)
        }
    }, [showChangeStockForm]);

    const handleDescriptionChange = async (id: string | undefined) => {
        if (typeof id === undefined) {
            console.warn('Cannot set stock of an item without an id')
            return
        }

        const description = {
            description: newItemDescription
        };

        instance.patch(`/item/${id}/description`, description).then(response => {
            handleAlert({
                severity: 'success',
                text: response.data.message,
                open: true,
            })
            setNewItemDescription(null)
            window.location.reload()
        }).catch(error => {
            handleAlert({
                severity: 'danger',
                text: error.message,
                open: true,
            })
        });
    }

    const handleStockChange = async (id: string | undefined) => {
        if (typeof id === undefined) {
            console.warn('Cannot set stock of an item without an id')
            return
        }
        instance.patch(`/item/${id}/stock/${newStockValue}`)
            .then(response => {
                handleAlert({
                    severity: "success",
                    text: response.data.message,
                    open: true,
                })
                setShowChangeStockForm(false)
            }).catch(error => {
            handleAlert({
                severity: "danger",
                text: error.message,
                open: true
            })
        })
    }

    const handleDelete = async () => {
        if (!item?._id) {
            console.warn('Cannot delete an item without an id');
            return;
        }
        await instance.delete(`/item/${item._id}`)
            .then(response => {
                handleAlert({
                    severity: "danger",
                    text: response.data,
                    open: true
                })
            }).catch(error => {
                handleAlert({
                    severity: "danger",
                    text: error.message,
                    open: true
                })
            })

    };


    const handleSubmitNewPrice = () => {
        const itemId = item?._id
        const salePrice = {
            amount: newPrice,
            currency: "DKK"
        }
        instance.patch(`/item/${itemId}/price`, salePrice).then(response => {
            handleAlert({
                severity: "success",
                text: response.data.message,
                open: true,
            })
            setNewPrice(-1)
        }).catch(error => {
            handleAlert({
                severity: "danger",
                text: error.message,
                open: true
            })
        })
    }

    if (!item) {
        return (<></>)
    }


    return (
        <>
            <Modal
                className={"bg-gray-200 w-fit p-12 mx-auto h-fit rounded-2xl mt-28 space-y-6"}

                isOpen={props.open} onRequestClose={props.onRequestClose}>

                <div className={"flex justify-between"}>
                    <div className={"flex space-x-2"}>
                        <h1 className={"text-2xl text-[#50A6A1]"}>Item</h1>

                        <h1 className={"text-2xl text-gray-500"}>{item?.name}</h1>
                    </div>
                    <div>
                        <Link to={`http://localhost:5173/item/${item?._id}`}><ArrowsPointingOutIcon
                            className={"h-6 w-6 text-gray-500 my-auto"}/></Link>
                    </div>
                </div>
                <div className={"flex space-x-2"}>
                    <Button color={"danger"} onClick={() => handleDelete}>Delete</Button>
                </div>
                <BodySheet
                >

                    {item && (
                        <Table className={"z-30 max-w-[50vw]"}>
                            <tbody>
                            <tr>
                                <td>Description</td>
                                {newItemDescription === null ? (
                                        <td onClick={() => setNewItemDescription(item?.description || "")}>
                                            <Chip
                                                endDecorator={<PencilSquareIcon
                                                    className='h-4 w-4 text-black select-none'/>}
                                            >{item.description}</Chip>
                                        </td>)
                                    : (<td>
                                        <form className={"flex"}>
                                            <Input
                                                type="text"
                                                placeholder="Description"
                                                size="sm"
                                                color="neutral"
                                                variant="outlined"
                                                value={newItemDescription}
                                                onChange={(e) => setNewItemDescription(e.target.value)}
                                            />
                                            <Button variant='solid' size="sm" type='button'
                                                    onClick={() => handleDescriptionChange(item._id)}>Change</Button>
                                            <Button variant='outlined' color='danger' size="sm" type='button'
                                                    onClick={() => setNewItemDescription(null)}>Cancel</Button>
                                        </form>
                                    </td>)
                                }
                            </tr>
                            <tr>
                                <td>Stock</td>
                                {!showChangeStockForm && (
                                    <td onClick={() => setShowChangeStockForm(true)}
                                        className=' select-none cursor-pointer'
                                    ><Chip
                                        endDecorator={<PencilSquareIcon
                                            className='h-4 w-4 text-black select-none'/>}
                                    >{item.stock}</Chip>
                                    </td>

                                )}


                                {showChangeStockForm && (
                                    <td>
                                        <form className='flex'>
                                            <Input
                                                type="number"
                                                placeholder='item stock'
                                                size="sm"
                                                color="neutral"
                                                variant="outlined"
                                                value={newStockValue}
                                                onChange={(e) => setNewStockValue(Number(e.target.value))}
                                            />
                                            <Button variant='solid' size="sm" type='button'
                                                    onClick={() => handleStockChange(item._id)}>Change</Button>
                                            <Button variant='outlined' color='danger' size="sm" type='button'
                                                    onClick={() => setShowChangeStockForm(false)}>Cancel</Button>


                                        </form>
                                    </td>
                                )}

                            </tr>
                            <tr>
                                <td>Price</td>
                                {newPrice >= 0 ? (
                                        <td>
                                            <form className={"flex space-x-1"}>
                                                <Input
                                                    size={"sm"}
                                                    type={"number"}
                                                    value={newPrice}
                                                    onChange={(e) => setNewPrice(e.target.valueAsNumber)}
                                                />

                                                <Button size={"sm"} onClick={() => handleSubmitNewPrice()}>
                                                    Change
                                                </Button>
                                                <Button size={"sm"} variant={"outlined"} color={"danger"}
                                                        onClick={() => setNewPrice(-1)}>
                                                    X
                                                </Button>
                                            </form>
                                        </td>
                                    ) :
                                    <td onClick={() => setNewPrice(item.salePrice.amount)}>
                                        <Chip
                                            endDecorator={<PencilSquareIcon
                                                className='h-4 w-4 text-black select-none'/>}>
                                            {item.salePrice?.amount} {item.salePrice?.currency === "DKK"
                                            ? (<>kr.</>)
                                            : (<></>)}
                                        </Chip>
                                    </td>
                                }
                            </tr>
                            <tr>
                                <td>
                                    Currency
                                </td>
                                <td>
                                    {item.salePrice.currency}
                                </td>
                            </tr>
                            </tbody>
                        </Table>
                    )}
                </BodySheet>
            </Modal>
        </>
    )
}
