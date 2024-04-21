import Sheet from "@mui/joy/Sheet";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import {useState} from "react";
import axios from "axios";

export function User () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleLogin = async () => {
        const loginInfo = {
            email: email,
            password: password
        }
        console.log(loginInfo);
        const loggedIn = await axios.post("http://localhost:3000/user/login", loginInfo);
        const token = loggedIn.data.token
        console.log(loggedIn);
        localStorage.setItem("token", token)
    }

    return (
        <>
        <h1>User</h1>
            <Sheet>
                <form className={"max-w-[30%] mx-auto"}>
                    <Input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={() => handleLogin()}>Submit</Button>
                </form>
            </Sheet>
        </>
    )
}