import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Ibom, Iorganisation} from "../../types.ts";
import {instance} from "../../services/backend-api/axiosConfig.ts";
import {BodySheet} from "../../components/BodySheet.tsx";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import {CardContent, List, ListItem} from "@mui/joy";

interface entryToAdd {
    orgId: string;
    typeOfEntry: string;
    idOfEntry: string;
}


export const OrganisationPage = () => {
    const {organisation} = useParams()
    const [organisationData, setOrganisationData] = useState<Iorganisation | null>(null)
    const [entryToAddData, setEntryToAddData] = useState<Ibom[]>([])
    const [selectorShown, setSelectorShown] = useState<"BOM" | "Item" | "Order" | null>(null)
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
        setSelectorShown(null)
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
                <div className={"mx-auto"}>
                    <div className={"flex space-x-2"}>
                    <h1 className={"text-2xl text-[#50A6A1]"}>Organisation</h1>
                    <h1 className={"text-2xl text-gray-500"}>{organisationData?.name}</h1>
                    </div>
                    <ul>
                        <li>
                            Users:
                            {organisationData?.users?.map((user) => (
                                <Card key={user._id}>
                                    <CardContent>
                                        <p>{user.name} - {user.admin ? "Admin" : "Not admin"}</p>
                                    </CardContent>

                                </Card>
                            ))}
                        </li>
                        <li>
                            <List>

                                <a onClick={() => handleBomClick()}>Boms:</a>
                                {organisationData?.boms?.map((bom) => (
                                    <ListItem>{bom}</ListItem>
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
                            </List>
                        </li>
                        <li>
                            <List>
                                <a>Items:</a>
                                {organisationData?.items?.map((item) => (
                                    <ListItem>{item}</ListItem>
                                ))}
                            </List>
                        </li>
                        <li>
                            <List>
                                <a>Customers:</a>
                                {organisationData?.customers?.map((customer) => (
                                    <ListItem>{customer}</ListItem>
                                ))}
                            </List>
                        </li>
                    </ul>
                </div>
            </BodySheet>
        </>
    )
}
