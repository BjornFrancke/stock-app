import Sheet from "@mui/joy/Sheet";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export function Login () {
    const [loginCredentials, setLoginCredentials] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginCredentials({
            ...loginCredentials,
            [e.target.name]: e.target.value,
        })
    }

    const handleLogin = async () => {
        const loginInfo = {
            email: loginCredentials.email,
            password: loginCredentials.password,
        }
        console.log(loginInfo);
        const loggedIn = await axios.post("http://localhost:3000/user/login", loginInfo);
        const token = loggedIn.data.token
        console.log(loggedIn);
        localStorage.setItem("token", token)
        navigate("/items");
    }

    return (
        <>
            <Sheet
                className={"mx-auto mt-6 space-y-4"}
                sx={{
                    maxWidth: 800,
                    borderRadius: "md",
                    p: 3,
                    boxShadow: "lg",
                }}
            >
                <h1 className="text-xl mb-12">Login</h1>

                <form className={"max-w-[30%] mx-auto"}>
                    <Input
                        type="text"
                        name={"email"}
                        placeholder="email"
                        value={loginCredentials.email}
                        onChange={(e) => handleChange(e)}
                    />
                    <Input
                        type="password"
                        name={"password"}
                        placeholder="password"
                        value={loginCredentials.password}
                        onChange={(e) => handleChange(e)}
                    />
                    <Button onClick={() => handleLogin()}>Submit</Button>
                </form>
            </Sheet>
        </>
    )
}