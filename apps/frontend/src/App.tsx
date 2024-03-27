import './index.css'
import {useState, useEffect} from 'react';
import axios from 'axios';
import {Iitems} from "./types.ts";

const NewListAllItems = () => {
    const [items, setItems] = useState([]);

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

    return (
        <ul>
            {items.map((item: Iitems) => (
                <li key={item._id}>
                    {item.name} - {item.stock}{' '}
                    {item._id && <button onClick={() => handleDelete(item._id)}>Delete</button>}                </li>
            ))}
        </ul>
    );
};



    function App() {

        return (
      <>
          <h1>hello</h1>
          <div className={"bg-gray-300 w-fit h-fit p-6"}>
              <NewListAllItems/>
          </div>
      </>
  )
}

export default App
