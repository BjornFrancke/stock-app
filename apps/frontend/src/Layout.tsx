import "../src/index.css"
import {Outlet} from "react-router-dom";
import {NavBar} from "./components/NavBar.tsx";
import {CssVarsProvider} from "@mui/joy";
import theme from "./theme.ts";

const Layout = () => {
    return (
        <>
            <CssVarsProvider theme={theme}/>
            <NavBar/>

            <Outlet/>
        </>
    )
};

export default Layout;