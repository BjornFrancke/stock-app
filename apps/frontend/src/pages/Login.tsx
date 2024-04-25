import Sheet from "@mui/joy/Sheet";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {CssVarsProvider} from "@mui/joy";
import theme from "../theme.ts";


export function Login () {
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
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
        setIsLoggingIn(true)
        const loggedIn = await axios.post("http://localhost:3000/user/login", loginInfo);
        const token = loggedIn.data.token
        setIsLoggingIn(false)
        console.log(loggedIn);
        localStorage.setItem("token", token)
        navigate("/items");
    }

    return (
        <>
            <CssVarsProvider theme={theme}/>

            <Sheet
                className={"mx-auto mt-6 space-y-4"}
                sx={{
                    maxWidth: 400,
                    borderRadius: "md",
                    p: 3,
                    boxShadow: "lg",
                    backgroundColor: "#50A6A1"
                }}
            >
                <div className={"mx-auto  w-fit space-y-4"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 25 25">
                        <path fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M10 15v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2m6-10v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2m6 10v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2M6 16v-3m6-7V3m6 13v-3"></path>
                    </svg>
                    <h1 className="text-center text-white text-xl">Login</h1>

                </div>
                <div className={"w-[80%] mx-auto space-y-4"}>
                <form className={"space-y-2"}>

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
                </form>
                <Button className={"w-full"} loading={isLoggingIn} variant={"soft"} onClick={() => handleLogin()}>Submit</Button>
</div>
            </Sheet>
        </>
    )
}