import './index.css'
import {ListAllItems} from "./components/ListAllItems";
import {ListAllBoms} from './components/ListAllBoms';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Layout from './Layout';
import {Home} from './pages/Home';
import {Orders} from './pages/Orders';
import {Customer} from './pages/Customer';
import {Settings} from "./pages/Settings.tsx";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="items" element={<ListAllItems/>}/>
                    <Route path="boms" element={<ListAllBoms/>}/>
                    <Route path="orders" element={<Orders/>}/>
                    <Route path="customer" element={<Customer/>}/>
                    <Route path="settings" element={<Settings/>}/>
                </Route>

            </Routes>
        </BrowserRouter>
    )
}

export default App;
