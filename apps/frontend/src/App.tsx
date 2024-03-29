import './index.css'
import { ListAllItems } from "./components/ListAllItems";
import { ListAllBoms } from './components/ListAllBoms';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import { Home } from './pages/Home';


function App() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
            <Route index element={<Home/>}/>
            <Route path="items" element={<ListAllItems/>}/>
            <Route path="boms" element={<ListAllBoms/>}/>
            </Route>
            
        </Routes>
        </BrowserRouter>
    )
}

export default App;
