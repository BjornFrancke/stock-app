import './index.css'
import {ListAllItems} from "./components/ListAllItems";
import {ListAllBoms} from './components/ListAllBoms';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Layout from './Layout';
import {Home} from './pages/Home';
import {Orders} from './pages/Orders';
import {Customer} from './pages/Customer';
import {Settings} from "./pages/Settings.tsx";
import {Manufacturing} from "./pages/Manufacturing.tsx";
import {Item} from "./pages/Item/item.tsx";
import {Login} from "./pages/Login.tsx";
import {Profile} from "./pages/Profile.tsx";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="items" element={<ListAllItems/>}/>
                    <Route path="boms" element={<ListAllBoms/>}/>
                    <Route path="manufacturing" element={<Manufacturing/>}/>
                    <Route path="orders" element={<Orders/>}/>
                    <Route path="customer" element={<Customer/>}/>
                    <Route path="settings" element={<Settings/>}/>
                    <Route path="/item/:item" element={<Item/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                </Route>

            </Routes>
        </BrowserRouter>
    )
}

export default App;
