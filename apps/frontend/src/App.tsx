import './index.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Iitems } from "./types.ts";

const NewListAllItems = () => {
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false); // control form visibility
    const [newItemName, setNewItemName] = useState(''); // handle new item name
    const [newItemStock, setNewItemStock] = useState(0); // handle new item stock amount

    // Fetch items initially
    useEffect(() => {
        fetchItems();
    }, []);

    // Make the apiCall a separate function so it can be called again after delete
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
            <ul>
                {items.map((item: Iitems) => (
                    <li key={item._id}>
                        {item.name} - {item.stock}{' '}
                        {item._id && <button onClick={() => handleDelete(item._id)}>Delete</button>}
                    </li>
                ))}
            </ul>
            <button onClick={() => setShowForm(true)}>Create Item</button>
            {showForm && <button onClick={() => setShowForm(false)}>Dismiss</button>}

            {
                showForm && (
                    <form>
                        <input
                            type="text"
                            placeholder="Item name"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Item stock"
                            value={newItemStock}
                            onChange={(e) => setNewItemStock(Number(e.target.value))}
                        />
                        <button type="button" onClick={handleSubmitNewItem}>Create</button>
                    </form>
                )
            }
        </>
    );
};

function App() {
    return (
        <>
            <h1>Hello</h1>
            <div className={"bg-gray-300 w-fit h-fit p-6"}>
                <NewListAllItems />
            </div>
        </>
    )
}

export default App;
