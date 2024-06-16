import {useEffect, useState} from "react";
import {Iuser} from "../../types.ts";
import axios from "axios";
import Card from "@mui/joy/Card";
import {CardContent, Typography} from "@mui/joy";


export function UserList() {
    const [users, setUser] = useState<Iuser[] | null>([])



    const fetchUsers = async () => {
        axios.get('http://localhost:3000/user/users').then(results => {
            setUser(results.data)
            console.log("Checked" + results.status + results.data[0].name)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        fetchUsers()
    }, []);
    return (
        <div>
            <h1>Users:</h1>
            <div></div>
            {users?.map((user: Iuser) => (
                <Card key={user._id}>
                    <CardContent>
                        <Typography level="title-md">
                            {user.name}
                        </Typography>
                        <Typography>
                            {user.email}
                        </Typography>

                    </CardContent>
                </Card>
            ))}

        </div>
    )
}
