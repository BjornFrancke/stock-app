import './index.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Iitems } from "./types.ts";
import Modal from 'react-modal';
import Button from '@mui/joy/Button';
import Table from '@mui/joy/Table';
import {Input} from "@mui/joy";
import Card from '@mui/joy/Card';
import Chip from "@mui/joy/Chip"
import {ChipDelete} from "@mui/joy";


const ListAllItems = () => {
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false); // control form visibility
    const [newItemName, setNewItemName] = useState(''); // handle new item name
    const [newItemStock, setNewItemStock] = useState(0); // handle new item stock amount
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<Iitems | null>(null) // Details of the clicked item

    // Fetch items initially
    useEffect(() => {
        fetchItems();
    }, []);

    // Make the apiCall a separate function, so it can be called again after delete
    const fetchItems = async () => {
        const response = await axios.get('http://localhost:3000/item/findAll');
        setItems(response.data);
    };

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

            <Table className={"max-w-[50%]"}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Stock</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                    {items.map((item: Iitems) => (
                        <tr key={item._id}>
                            <td onClick={() => handleItemClick(item)}>{item.name}</td>
                            <td>{item.stock}</td>
                            <td>{item._id &&
                                <Chip
                                variant="soft"
                                color="danger"
                                size="sm"
                                endDecorator={<ChipDelete onClick={() => handleDelete(item._id)} />}
                                >
                                    Delete
                                </Chip>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Item Details"
                className={"bg-gray-500 w-fit p-12 mx-auto h-fit"}
            >
                {selectedItem && (
                    <div className={""}>
                        <h2>{selectedItem.name}</h2>
                        <p>{selectedItem.description}</p>
                        <p>{selectedItem.stock}</p>
                    </div>
                )}
                <Button variant={"solid"} className={"bg-blue-500 p-2 px-3 rounded-2xl"} onClick={handleCloseModal}> Close</Button>
            </Modal>
            {!showForm && <Button variant="solid" onClick={() => setShowForm(true)}>Create Item</Button>}
            {showForm && <Button variant="solid" onClick={() => setShowForm(false)}>Dismiss</Button>}

            {
                showForm && (
                    <Card
                        color="neutral"
                        orientation="vertical"
                        variant="outlined"
                        size={"sm"}
                        className={"w-fit flex justify-center"}
                    >
                    <form>
                        <Input
                            type="text"
                            placeholder="Item name"
                            size="md"
                            variant="soft"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                        />
                        <Input
                            type="number"
                            placeholder="Item stock"
                            size="md"
                            variant="soft"
                            value={newItemStock}
                            onChange={(e) => setNewItemStock(Number(e.target.value))}
                        />
                        <Button variant={"solid"} type="button" onClick={handleSubmitNewItem}>Create</Button>
                    </form>
                    </Card>
                )
            }
        </>
    );
};

function App() {
    return (
        <>
            <h1>Hello</h1>
            <div className={"w-fit h-fit p-6"}>
                <ListAllItems />
            </div>
        </>
    )
}

export default App;
