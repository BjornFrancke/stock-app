import axios from 'axios'
import './index.css'


const apiCall = () => {
    axios.get('http://localhost:3000/item/findAll').then((data) => {
        //this console.log will be in our frontend console
        console.log(data)
    })
}

function App() {

  return (
      <>
          <h1>hello</h1>
          <button onClick={apiCall}>Make API Call</button>

      </>
  )
}

export default App
