import {Iorganisation, Iuser} from "../../types.ts";
import {instance} from "../../services/backend-api/axiosConfig.ts";
import { useEffect, useState } from "react";
import Button from "@mui/joy/Button";
import {Link} from "react-router-dom";

export const OrganisationList = () => {
    const [organisations, setOrganisations] = useState<Iorganisation[] | null>([])
    const [users, setUsers] = useState<Iuser[] | null>([])
    const [selectedOrganisationId, setSelectedOrganisatioId] = useState<string>("")
    const [selectedUserId, setSelectedUserId] = useState<string>("")


    const fetchOrganisations = async () => {
        instance.get('/organisation').then(results => {
            setOrganisations(results.data)
            console.log("Checked" + results.status + results.data[0].name)
        }).catch(error => {
            console.log(error)
        })
    }

    const handleAddUserToOrganisation = async () => {
        const userToOrganisationData = {
            userId: selectedUserId,
        }
        instance.patch(`/organisation/${selectedOrganisationId}`,userToOrganisationData).then(results => {
            console.log(results)
            fetchOrganisations()
        }).catch(error => {
            console.log(error)
        })
    }

    const fetchUsers = async () => {
        instance.get('/user/users').then(results => {
            setUsers(results.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        fetchOrganisations()
        fetchUsers()
    }, []);

    return (
        <>
            {organisations?.map((organisation) => (
            <ul>
                <li key={organisation._id} className={"flex flex-col space-x-1"}>
                    <a onClick={() => setSelectedOrganisatioId(organisation._id)}>{organisation.name}</a>
                    {selectedOrganisationId === organisation._id && (
                        <div className={"bg-gray-200 rounded-lg border-gray-300 p-4"}>
                            <Button onClick={() => setSelectedOrganisatioId("")}>X</Button>
                           <Link to={`/organisation/${selectedOrganisationId}`}>Open</Link>
                            <p>users</p>
                            <ul>
                                {organisation.users?.map((user) => (
                                    <li key={user._id} className={"flex flex-col space-x-1"}>{user.name}</li>
                                ))}
                            </ul>
                            <p>Add users</p>
                            <form className={"flex space-x-2"}>
                                <select
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md w-1/2"
                                >
                                    <option>Select a user</option>
                                    {users?.map((user: Iuser) => (
                                        <option key={user._id} value={user._id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                                <Button onClick={handleAddUserToOrganisation}>Add user</Button>
                            </form>
                        </div>
                    )}
                </li>
            </ul>
            ))}
        </>
    )
}
