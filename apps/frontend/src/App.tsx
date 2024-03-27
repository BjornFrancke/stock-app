import './index.css'
import { ListAllItems } from "./components/ListAllItems";
import { ListAllBoms } from './components/ListAllBoms';


function App() {
    return (
        <>
            <h1>Hello</h1>
            <div className={"w-fit h-fit p-6"}>
                <ListAllItems />
                <ListAllBoms />
            </div>
        </>
    )
}

export default App;
