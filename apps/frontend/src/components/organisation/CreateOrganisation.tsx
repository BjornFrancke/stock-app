import Button from "@mui/joy/Button"
import Input from "@mui/joy/Input"
import { useState } from "react"
import {instance} from "../../services/backend-api/axiosConfig.ts";

export const CreateOrganisation = () => {
    const [newOrganisation, setNewOrganisation] = useState({
        name: "",
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewOrganisation({
            ...newOrganisation,
            [event.target.name]: event.target.value
        });
    }

    const handleCreateNewOrganisation = () => {
        instance.post("/organisation", newOrganisation).then((response) => {
            console.log(response)
            setNewOrganisation
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div>
        <form>
            <Input onChange={handleChange} value={newOrganisation.name} type="text" name="name" placeholder="Name" />
            <Button onClick={() => handleCreateNewOrganisation()}>Submit</Button>
        </form>
        </div>
    )
}
