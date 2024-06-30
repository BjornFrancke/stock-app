import {Iorganisation} from "../../types.ts";
import {instance} from "../../services/backend-api/axiosConfig.ts";
import { useEffect, useState } from "react";

export const OrganisationList = () => {
    const [organisations, setOrganisations] = useState<Iorganisation[] | null>([])



    const fetchOrganisations = async () => {
        instance.get('/organisation').then(results => {
            setOrganisations(results.data)
            console.log("Checked" + results.status + results.data[0].name)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        fetchOrganisations()
    }, []);

    return (
        <>
            <ul>
            {organisations?.map((organisation) => (
                <li>{organisation.name}</li>
            ))}
            </ul>
        </>
    )
}
