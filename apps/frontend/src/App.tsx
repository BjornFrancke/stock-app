import './index.css'
import { ListAllItems } from "./components/ListAllItems";


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
