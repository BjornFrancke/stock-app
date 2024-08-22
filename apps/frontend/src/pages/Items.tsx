import '../index.css'
import {useEffect, useState} from 'react';
import {Iitems} from "../types.ts";
import Button from '@mui/joy/Button';
import Table from '@mui/joy/Table';
import {Alert, ChipDelete, CircularProgress, Input} from "@mui/joy";
import Chip from "@mui/joy/Chip"
import {useSearchParams} from "react-router-dom";
import {instance} from "../services/backend-api/axiosConfig.ts";
import {AlertMessage, Ialert} from "../components/AlertMessage.tsx";
import {BodySheet} from "../components/BodySheet.tsx";
import {SelectedItemModal} from "../components/Items/SelectedItemModal.tsx";


export const Items = () => {
    const [items, setItems] = useState<Iitems[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newItemData, setNewItemData] = useState<{
        name: string,
        stock: number
    }>({
        name: "",
        stock: 0,
    })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<Iitems | null>(null)
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

    const handleAlert = ({open, text, severity}: Ialert) => {
        setAlert({open, text, severity});
    }

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
                    setIsModalOpen(true);
                }
            }
        }

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
    const handleSubmitNewItem = async () => {
        instance.post('/item', newItemData).then(response => {
            setAlert({
                severity: "success",
                text: response.data.message,
                open: true,
            })
            fetchItems()
            setNewItemData({
                name: "",
                stock: 0
            })
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

            <SelectedItemModal handleAlert={handleAlert} item={selectedItem} onRequestClose={handleCloseModal}
                               open={isModalOpen}/>

            <BodySheet>
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
                                            value={newItemData.name}
                                            onChange={(e) => setNewItemData({
                                                ...newItemData,
                                                name: e.target.value
                                            })}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            type="number"
                                            placeholder="Item stock"
                                            size="md"
                                            variant="outlined"
                                            value={newItemData.stock}
                                            onChange={(e) => setNewItemData({
                                                ...newItemData,
                                                stock: Number(e.target.value)
                                            })}
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

                </div>
            </BodySheet>
        </>
    );
};
