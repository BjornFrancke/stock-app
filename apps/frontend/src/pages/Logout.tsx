import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export function Logout() {

    const navigate = useNavigate();

  async function handleLogout() {
        console.log("Logging out...");
        localStorage.removeItem("token");
        navigate("/")

    }


    useEffect(() => {
        handleLogout()
    }, []);
    return (
        <>
        <h1>Logging out...</h1>
        </>
    )
}