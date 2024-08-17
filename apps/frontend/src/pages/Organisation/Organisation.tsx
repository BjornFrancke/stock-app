import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Ibom, Iorganisation} from "../../types.ts";
import {instance} from "../../services/backend-api/axiosConfig.ts";
import {BodySheet} from "../../components/BodySheet.tsx";
import Button from "@mui/joy/Button";

interface entryToAdd {
    orgId: string;
    typeOfEntry: string;
    idOfEntry: string;
}


export const OrganisationPage = () => {
    const {organisation} = useParams()
    const [organisationData, setOrganisationData] = useState<Iorganisation | null>(null)
    const [entryToAddData, setEntryToAddData] = useState<Ibom[]>([])
    const [selectorShown, setSelectorShown] = useState<"BOM" | "Item" | "Order" | "">("")
    const [entryToAdd, setEntryToAdd] = useState<entryToAdd>({
        orgId: "",
        typeOfEntry: "",
        idOfEntry: "",
    })
    console.log(organisation)

    const fetchOrganisation = async () => {
        instance.get(`/organisation/${organisation}`).then(results => {
            console.log(results.data.name)
            setOrganisationData(results.data)
        }).catch(error => {
            console.log(error);
        })
    }

    const fetchBoms = async () => {
        const response = await instance.get("/bom")
        if (!response) {
            console.log("error")
        }
        return response.data
    }


    const handleSubmitEntry = async () => {
        await instance.post("/organisation/addEntry", entryToAdd)
        setSelectorShown("")
        window.document.location.reload()
    }

    const handleBomClick = async () => {
        setSelectorShown("BOM")
        setEntryToAdd({
            ...entryToAdd,
            typeOfEntry: "BOM",
            orgId: organisationData?._id || ""
        })
        const boms: Ibom[] = await fetchBoms()
        if (!boms) {
            return
        }

        setEntryToAddData(boms)
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
                            <a onClick={() => handleBomClick()}>Boms:</a>
                            {organisationData?.boms?.map((bom) => (
                                <p>{bom}</p>
                            ))}
                            {selectorShown === "BOM" && (
                                <>
                                    <p>Add boms</p>
                                    <select
                                        onChange={(e) => (setEntryToAdd({
                                            ...entryToAdd,
                                            idOfEntry: e.target.value,
                                        }))}
                                        value={entryToAdd.idOfEntry}
                                    >
                                        {entryToAddData.map((bom: Ibom) => (
                                            <option value={bom._id} key={bom._id}>{bom.name}</option>

                                        ))}
                                    </select>
                                    <Button onClick={() => handleSubmitEntry()}>Submit</Button>
                                </>
                            )}
                        </li>
                    </ul>
                </div>
            </BodySheet>
        </>
    )
}
