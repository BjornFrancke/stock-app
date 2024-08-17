import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Iorganisation} from "../../types.ts";
import {instance} from "../../services/backend-api/axiosConfig.ts";
import {BodySheet} from "../../components/BodySheet.tsx";

export const OrganisationPage = () => {
    const {organisation} = useParams()
    const [organisationData, setOrganisationData] = useState<Iorganisation | null>(null)
    console.log(organisation)

    const fetchOrganisation = async() => {
        instance.get(`/organisation/${organisation}`).then(results => {
            console.log(results.data.name)
            setOrganisationData(results.data)
        }).catch(error => {
            console.log(error);
        })
    }

    useEffect(() => {
        fetchOrganisation()
    }, []);

    return (
        <>
            <BodySheet>
            <h1>Organisation</h1>
            <div className={"mx-auto"}>
                <ul>
                    <li>{organisationData?.name}</li>
                    <li>
                        Users:
                        {organisationData?.users?.map((user) => (
                            <p>{user.name} - {user.admin ? "Admin" : "Not admin"}</p>
                        ))}
                    </li>
                    <li>
                        Boms:
                        {organisationData?.boms?.map((bom) => (
                            <p>{bom}</p>
                        ))}
                    </li>
                </ul>
            </div>
            </BodySheet>
        </>
    )
}
