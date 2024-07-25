import '../index.css'
import {useEffect, useState} from 'react';
import {Iitems} from "../types.ts";
import Modal from 'react-modal';
import Button from '@mui/joy/Button';
import Table from '@mui/joy/Table';
import {Alert, ChipDelete, CircularProgress, Input} from "@mui/joy";
import Chip from "@mui/joy/Chip"
import {ArrowsPointingOutIcon, PencilSquareIcon} from '@heroicons/react/16/solid';
import Sheet from "@mui/joy/Sheet";
import {Link, useSearchParams} from "react-router-dom";
import {instance} from "../services/backend-api/axiosConfig.ts";
import {AlertMessage, Ialert} from "../components/AlertMessage.tsx";


export const Items = () => {
    const [items, setItems] = useState<Iitems[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [showChangeStockForm, setShowChangeStockForm] = useState(false)
    const [newItemName, setNewItemName] = useState('');
    const [newItemStock, setNewItemStock] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<Iitems | null>(null)
    const [newPrice, setNewPrice] = useState(-1)
    const [newStockValue, setNewStockValue] = useState(0)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [alert, setAlert] = useState<Ialert>({
        open: false,
        text: '',
        severity: 'success'

    })
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        handleSearchParams();
    }, [items]);

    const fetchItems = async () => {
        instance.get('/item').then(response => {
            setItems(response.data);
            setLoading(false);
        }).catch(error => {
            setError(error.message);
            setLoading(false);
        })

    };

    const handleSearchParams = () => {
        if (searchParams) {
            const search = searchParams.get('id')
            if (search && items.length > 0) {
                const item = items.find(item => item._id === search);
                if (item) {
                    setSelectedItem(item);
                    setNewStockValue(item.stock);
                    setIsModalOpen(true);
                }
            }
        }

    }

    const handleStockChange = async (id: string | undefined) => {
        if (typeof id === undefined) {
            console.warn('Cannot set stock of an item without an id')
            return
        }
        instance.patch(`/item/${id}/stock/${newStockValue}`)
            .then(response => {
                setAlert({
                    severity: "success",
                    text: response.data.message,
                    open: true,
                })
                fetchItems()
                setShowChangeStockForm(false)
            }).catch(error => {
            setAlert({
                severity: "danger",
                text: error.message,
                open: true
            })
        })
    }

    const handleDelete = async (id: string | undefined) => {
        if (typeof id === 'undefined') {
            console.warn('Cannot delete an item without an id');
            return;
        }
        await instance.delete(`/item/${id}`)
            .then(response => {
                fetchItems();
                setAlert({
                    severity: "danger",
                    text: response.data,
                    open: true
                })
            }).catch(error => {
                setAlert({
                    severity: "danger",
                    text: error.message,
                    open: true
                })
            })

    };


    const handleItemClick = (item: Iitems) => {
        setSelectedItem(item);
        setNewStockValue(item.stock)
        if (item._id !== undefined) {
            setSearchParams({id: item._id});
        } else {
            setSearchParams({id: ''});
        }
        setIsModalOpen(true)
    }
    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSearchParams()
    }

    const handleSubmitNewPrice = () => {
        const itemId = selectedItem?._id
        const salePrice = {
            amount: newPrice,
            currency: "DKK"
        }
        instance.patch(`/item/${itemId}/price`, salePrice).then(response => {
            setAlert({
                severity: "success",
                text: response.data.message,
                open: true,
            })
            fetchItems()
            setNewPrice(-1)
        }).catch(error => {
            setAlert({
                severity: "danger",
                text: error.message,
                open: true
            })
        })
    }

    const handleSubmitNewItem = async () => {
        const itemData = {
            name: newItemName,
            stock: newItemStock
        };
        instance.post('/item', itemData).then(response => {
            setAlert({
                severity: "success",
                text: response.data.message,
                open: true,
            })
            fetchItems()
            setNewItemName('');
            setNewItemStock(0);
        }).catch(error => {
            setAlert({
                severity: "danger",
                text: error.message,
                open: true
            })
        })

    };

    const handleMessageClose = () => {
        setAlert({...alert, open: false});
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
                <AlertMessage alertContent={alert} onClose={() => handleMessageClose()}/>
                <h1 className="text-xl mb-12">Items</h1>
                {error && <Alert color={"danger"} variant={"solid"}>{error}</Alert>}
                {loading && (
                    <CircularProgress/>


                )}
                <div>
                    <Table borderAxis={"both"}>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Stock</th>
                            <th>Price</th>
                            <th>
                                {!showForm &&
                                    <Button variant={"outlined"}
                                            onClick={() => setShowForm(true)}>Create Item</Button>}
                                {showForm &&
                                    <Button disabled variant={"outlined"}
                                            onClick={() => setShowForm(true)}>Create Item</Button>}
                            </th>
                        </tr>
                        </thead>
                        <tbody>

                        {items.map((item: Iitems) => (
                            <tr key={item._id}>
                                <td onClick={() => handleItemClick(item)}
                                    className={"underline cursor-pointer"}>{item.name}</td>
                                <td>{item.stock}</td>
                                <td>{item.salePrice?.amount} {item.salePrice?.currency === "DKK" ? (<>kr.</>) : (<></>)}</td>
                                <td>{item._id && !isModalOpen &&
                                    <Chip
                                        variant="soft"
                                        color="danger"
                                        size="sm"
                                        className={"select-none"}
                                        endDecorator={<ChipDelete onClick={() => handleDelete(item._id)}/>}
                                    >
                                        Delete
                                    </Chip>}
                                </td>
                            </tr>
                        ))}
                        {
                            showForm && (
                                <tr>
                                    <td>
                                        <Input
                                            type="text"
                                            placeholder="Item name"
                                            size="md"
                                            variant="outlined"
                                            value={newItemName}
                                            onChange={(e) => setNewItemName(e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            type="number"
                                            placeholder="Item stock"
                                            size="md"
                                            variant="outlined"
                                            value={newItemStock}
                                            onChange={(e) => setNewItemStock(Number(e.target.value))}
                                        />
                                    </td>
                                    <td>
                                        <Button onClick={handleSubmitNewItem}>Submit</Button>
                                        <Button variant="solid" onClick={() => setShowForm(false)}
                                                className="max-h-4">Dismiss</Button>
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                    </Table>
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={handleCloseModal}
                        contentLabel="Item Details"
                        className={"bg-gray-200 w-fit p-12 mx-auto h-fit rounded-2xl mt-28 space-y-6"}
                    >
                        <div className={"flex justify-between"}>
                            <div className={"flex space-x-2"}>
                                <h1 className={"text-2xl text-[#50A6A1]"}>Item</h1>

                                <h1 className={"text-2xl text-gray-500"}>{selectedItem?.name}</h1>
                            </div>
                            <div>
                                <Link to={`http://localhost:5173/item/${selectedItem?._id}`}><ArrowsPointingOutIcon
                                    className={"h-6 w-6 text-gray-500 my-auto"}/></Link>
                            </div>
                        </div>
                        <Sheet
                            variant="outlined"
                            sx={{
                                maxWidth: 800,
                                minWidth: 800,
                                borderRadius: "md",
                                p: 6,
                                boxShadow: "lg",
                            }}
                        >

                            <Button variant={"solid"} onClick={handleCloseModal}> Close</Button>
                            {selectedItem && (
                                <Table className={"z-30 max-w-[50vw]"}>
                                    <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td>{selectedItem.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Description</td>
                                        <td>{selectedItem.description}</td>
                                    </tr>
                                    <tr>
                                        <td>Stock</td>
                                        {!showChangeStockForm && (
                                            <td onClick={() => setShowChangeStockForm(true)}
                                                className=' select-none cursor-pointer'
                                            ><Chip
                                                endDecorator={<PencilSquareIcon
                                                    className='h-4 w-4 text-black select-none'/>}
                                            >{selectedItem.stock}</Chip>
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
                                                            onClick={() => handleStockChange(selectedItem._id)}>Change</Button>
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
                                            <td onClick={() => setNewPrice(selectedItem.salePrice.amount)}>
                                                <Chip
                                                    endDecorator={<PencilSquareIcon
                                                        className='h-4 w-4 text-black select-none'/>}>
                                                    {selectedItem.salePrice?.amount} {selectedItem.salePrice?.currency === "DKK"
                                                    ? (<>kr.</>)
                                                    : (<></>)}
                                                </Chip>
                                            </td>
                                        }
                                    </tr>
                                    <tr>
                                        <td>ID</td>
                                        <td>{selectedItem._id}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            )}
                        </Sheet>
                    </Modal>


                </div>
            </Sheet>
        </>
    );
};
