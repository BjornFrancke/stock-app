import '../index.css'


import {useState, useEffect} from 'react';
import axios from 'axios';
import {Iitems} from "../types.ts";
import Modal from 'react-modal';
import Button from '@mui/joy/Button';
import Table from '@mui/joy/Table';
import {Input} from "@mui/joy";
import Chip from "@mui/joy/Chip"
import {ChipDelete} from "@mui/joy"
import {PencilSquareIcon} from '@heroicons/react/16/solid';
import Sheet from "@mui/joy/Sheet";

export const ListAllItems = () => {
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false); // control form visibility
    const [showChangeStockForm, setShowChangeStockForm] = useState(false)
    const [newItemName, setNewItemName] = useState(''); // handle new item name
    const [newItemStock, setNewItemStock] = useState(0); // handle new item stock amount
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<Iitems | null>(null) // Details of the clicked item
    const [newStockValue, setNewStockValue] = useState(0) // handle new stock value

    // Fetch items initially
    useEffect(() => {
        fetchItems();
    }, []);

    // Make the apiCall a separate function, so it can be called again after delete
    const fetchItems = async () => {
        const response = await axios.get('http://localhost:3000/item/findAll');
        setItems(response.data);
    };

    const handleStockChange = async (id: string | undefined) => {
        if (typeof id === undefined) {
            console.warn('Cannot set stock of an item without an id')
            return
        }
        await axios.patch(`http://localhost:3000/item/setStock/${id}/${newStockValue}`);
        setIsModalOpen(false)
        setShowChangeStockForm(false)
        fetchItems();
    }

    // Item deletion handler
    const handleDelete = async (id: string | undefined) => {
        // Send a DELETE request
        if (typeof id === 'undefined') {
            console.warn('Cannot delete an item without an id');
            return;
        }
        await axios.delete(`http://localhost:3000/item/delete/${id}`);
        // After deleting the item, fetch items again to refresh the list
        fetchItems();
    };

    // Handle showing items details
    const handleItemClick = (item: Iitems) => {
        setSelectedItem(item);
        setNewStockValue(item.stock)
        setIsModalOpen(true)
    }
    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    // Handle new item submit
    const handleSubmitNewItem = async () => {
        const itemData = {
            name: newItemName,
            stock: newItemStock
        };
        await axios.post('http://localhost:3000/item/create', itemData);
        // After creating new item, fetch items again to refresh the list
        fetchItems();
        // Hide form and reset values
        setShowForm(false);
        setNewItemName('');
        setNewItemStock(0);
    };

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
            <h1 className="text-xl mb-12">Items</h1>

            <div>
                <Table borderAxis={"both"}>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Stock</th>
                        <th>
                            {!showForm &&
                                <Button variant={"outlined"} sx={{color: "#50A6A1"}} onClick={() => setShowForm(true)}>Create Item</Button>}
                            {showForm &&
                                <Button disabled variant={"outlined"} sx={{color: "#50A6A1"}} onClick={() => setShowForm(true)}>Create Item</Button>}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item: Iitems) => (
                        <tr key={item._id}>
                            <td onClick={() => handleItemClick(item)}
                                className={"underline cursor-pointer"}>{item.name}</td>
                            <td>{item.stock}</td>
                            <td>{item._id && isModalOpen === false &&
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
                                        <Button variant="solid" onClick={() => setShowForm(false)} className="max-h-4">Dismiss</Button>
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
                    <div className={"flex space-x-2"}>
                        <h1 className={"text-2xl text-[#50A6A1]"}>Item</h1>

                            <h1 className={"text-2xl text-gray-500"}>{selectedItem?.name}</h1>
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
                                    <td>ID</td>
                                    <td>{selectedItem._id}</td>
                                </tr>
                            </Table>
                        )}
                    </Sheet>
                </Modal>


            </div>
            </Sheet>
        </>
    );
};