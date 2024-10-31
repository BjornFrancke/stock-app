import "../src/index.css"
import {Outlet} from "react-router-dom";
import {NavBar} from "./components/NavBar.tsx";
import {CssVarsProvider} from "@mui/joy";
import theme from "./theme.ts";
import {AdminMenu} from "./components/Admin/AdminMenu.tsx";

const Layout = () => {
    return (
        <>
            <CssVarsProvider theme={theme}/>
            <NavBar/>
            <AdminMenu/>

            <Outlet/>
        </>
    )
};

export default Layout;
