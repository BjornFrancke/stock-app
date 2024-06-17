import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export function RegisterUser() {
    const [newUser, setNewUser] = useState({
        email: "",
        name: "",
        password: "",
        password2: ""
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewUser({
            ...newUser,
            [event.target.name]: event.target.value
        });
    }


const navigate = useNavigate()

    const handleRegisterUser = () => {
        if (newUser.password === newUser.password2) {
            console.log("Matches")
            console.log("User registered successfully");
            const userData = {
                name: newUser.name,
                email: newUser.email,
            password: newUser.password
            }
            axios.post('http://localhost:3000/user/setup', userData).then(results => {
                console.log(results.data)
                navigate('/')
            }).catch(error => {
                console.log(error)
            })

        } else {
            console.log("Passwords do not match");
            setNewUser({
                ...newUser,
                password: "",
                password2: "",
            })
        }
    }

    return (
        <div className={"space-y-6 mt-6 max-w-[400px] mx-auto"}>
            <form className={"space-y-4"}>
                <Input
                    type="email"
                    placeholder="Email"
                    name={"email"}
                    autoComplete={"email"}
                    value={newUser.email}
                    onChange={handleChange}
                />
                <Input
                type="text"
                autoComplete="name"
                placeholder="Name"
                name={"name"}
                value={newUser.name}
                onChange={handleChange}
            />
                <div className={"space-y-2"}>
                <Input
                type="password"
                autoComplete={"new-password"}
                placeholder="Password"
                name={"password"}
                value={newUser.password}
                onChange={handleChange}
                />
                <Input
                    type="password"
                    autoComplete={"new-password"}
                    placeholder="Retype password"
                    name={"password2"}
                    value={newUser.password2}
                    onChange={handleChange}
                />
                </div>
            </form>
            <Button className={"w-full"} onClick={() => handleRegisterUser()}>Submit</Button>
        </div>
    )
}
