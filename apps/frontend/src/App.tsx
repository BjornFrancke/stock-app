import './index.css'
import {useState, useEffect} from 'react';
import axios from 'axios';

const ListAllItems = () => {
    const [items, setItems] = useState([])

    useEffect(() => {
        const apiCall = () => {
            axios.get('http://localhost:3000/item/findAll').then((data) => {
                // @ts-ignore
                setItems(data.data.map((result) => <li key={result.id}>{result.name}</li>))
            })
        }

        apiCall()
    }, [])

    return (
        <ul>{items}</ul>
    )
}


    function App() {

        return (
      <>
          <h1>hello</h1>
          <div className={"bg-gray-300 w-fit h-fit p-6"}>
              <ListAllItems/>
          </div>
      </>
  )
}

export default App
