import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import {useState} from "react";

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


    const handleRegisterUser = () => {
        if (newUser.password === newUser.password2) {
            console.log("Matches")
            console.log("User registered successfully");

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
                autoComplete={"off"}
                placeholder="Password"
                name={"password"}
                value={newUser.password}
                onChange={handleChange}
                />
                <Input
                    type="password"
                    autoComplete={"off"}
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