import './index.css'
import {Items} from "./pages/Items.tsx";
import {Boms} from './pages/Boms.tsx';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Layout from './Layout';
import {Dashboard} from './pages/Dashboard.tsx';
import {Orders} from './pages/Orders';
import {Customer} from './pages/Customer';
import {Settings} from "./pages/Settings.tsx";
import {Manufacturing} from "./pages/Manufacturing.tsx";
import {Item} from "./pages/Item/item.tsx";
import {Login} from "./pages/Login.tsx";
import {Profile} from "./pages/Profile.tsx";
import {Logout} from "./pages/Logout.tsx";
import {Admin} from "./pages/Admin.tsx";
import {SetupPage} from "./pages/Setup.tsx";
import {Bom} from "./pages/Bom/bom.tsx";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Dashboard/>}/>
                    <Route path="items" element={<Items/>}/>
                    <Route path="boms" element={<Boms/>}/>
                    <Route path="manufacturing" element={<Manufacturing/>}/>
                    <Route path="orders" element={<Orders/>}/>
                    <Route path="customer" element={<Customer/>}/>
                    <Route path="settings" element={<Settings/>}/>
                    <Route path="/item/:item" element={<Item/>}/>
                    <Route path="/bom/:bom" element={<Bom/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="admin" element={<Admin/>}/>
                    <Route path="setup" element={<SetupPage/>}/>
                </Route>
                <Route path="login" element={<Login/>}/>

                <Route path="/logout" element={<Logout/>}/>

            </Routes>
        </BrowserRouter>
    )
}

export default App;
