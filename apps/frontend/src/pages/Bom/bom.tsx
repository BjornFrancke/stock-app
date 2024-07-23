import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import {Ibom, Icomponent, Iitems} from "../../types.ts";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {instance} from "../../services/backend-api/axiosConfig.ts";
import {AlertMessage, Ialert} from "../../components/AlertMessage.tsx";

export const Bom = () => {
    const [bomData, setBomData] = useState<Ibom | null>(null);
    const [availableComponents, setAvailableComponents] = useState<Iitems[]>([]);
    const [alert, setAlert] = useState<Ialert>({open: false, text: '', severity: "success"})
    const {bom} = useParams();

    useEffect(() => {
        fetchBomData()
        fetchAvailableComponents()
    }, [bom]);

    const handleRemoveComponent = async (bomId: string | undefined, componentId: string | undefined) => {
        if (!bomId || !componentId) {
            console.warn("Invalid operation: BOM ID or Component ID is missing.");
            return;
        }

        instance.delete(`/bom/${bomId}/component/${componentId}`).then(response => {
            setAlert({
                severity: "danger",
                text: response.data.message,
                open: true
            })
            fetchBomData();

        }).catch(error => {
            setAlert({
                severity: "danger",
                text: error.message || JSON.stringify(error),
                open: true
            })
        })
    }

    const fetchBomData = async () => {
        console.log(bom)
        const response = await instance.get(`/bom/${bom}`);
        console.log(response.data)

        if (!response.data) {
            return
        }
        const bomCopy = {...response.data, components: [...response.data.components]};

        const componentNamesPromises = bomCopy.components.map(async (component: Icomponent) => {
            const name = await fetchComponentNameById(component.id);
            return {...component, name};
        });

        bomCopy.components = await Promise.all(componentNamesPromises);
        setBomData(bomCopy);


    };

    const fetchAvailableComponents = async () => {
        console.log("Fetch available components")
        try {
            const response = await instance.get('/item')
            console.log("fetchAvailableComponents", response.data)
            setAvailableComponents(response.data);
        } catch {
            console.error("Could to fetch availableComponents")
        }
    };

    const findProductsName = (bom: Ibom) => {
        const item = availableComponents.find(availableComponents => availableComponents._id === bom.product)
        if (item !== undefined) {
            return item.name
        } else {
            return bom.product
        }
    }

    const fetchComponentNameById = async (componentId: string | undefined) => {
        console.log("fetchComponentNameById", componentId)
        try {
            if (!componentId) {
                console.error('No component id provided')
            }
            return instance.get(`/item/${componentId}`).then(response => {
                console.log(response.data.name)
                return response.data.name
            }).catch(error =>
                console.log(error))
        } catch {
            console.error("Failed to fetch component name:");
            return "";
        }
    };
    const handleMessageClose = () => {
        setAlert({...alert, open: false});
    }

    return (
        <div className={"mx-auto w-fit mt-6 space-y-6"}>
            <AlertMessage alertContent={alert} onClose={() => handleMessageClose()}/>

            <div className={"flex space-x-2"}>

                <h1 className={"text-[#50A6A1] text-2xl"}>BOM</h1>
                <h1 className={"text-2xl text-gray-500"}>{bomData?.name}</h1>

            </div>
            <div className={"flex space-x-2"}>
                <Button color={"danger"}
                        size={"sm"}>Delete</Button>
            </div>
            <Sheet
                variant="outlined"
                sx={{
                    maxWidth: 800,
                    minWidth: 800,
                    borderRadius: "md",
                    p: 6,
                    boxShadow: "lg",
                }}
            >

                {bomData && (
                    <Table className={"z-30 max-w-[50vw]"}>
                        <tbody>
                        <tr>
                            <td>BOM ID</td>
                            <td>{bomData._id}</td>
                        </tr>
                        <tr>
                            <td>Name</td>
                            <td>{bomData.name}</td>
                        </tr>
                        <tr>
                            <td>Product</td>
                            <td>{findProductsName(bomData)}</td>
                        </tr>
                        </tbody>

                    </Table>

                )}
            </Sheet>

            <Sheet
                variant="outlined"
                className={"space-y-4"}
                sx={{
                    maxWidth: 800,
                    minWidth: 800,
                    borderRadius: "md",
                    p: 3,
                    boxShadow: "lg",
                }}>
                <div className={"flex space-x-2"}>
                    <h1 className={"my-auto"}>Components</h1>
                    <Button
                        size={"sm"}
                        variant={"outlined"}>
                        Add</Button>
                </div>
                {bomData && (
                    <Table
                        borderAxis={"both"}
                    >
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {bomData.components && bomData.components.map((component, index) => (
                            <tr key={index}>
                                <td>{component.name || component.id}</td>
                                <td>{component.amount}</td>
                                <td>
                                    <Button onClick={() => handleRemoveComponent(bomData._id, component.id)}>
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )}
            </Sheet>

        </div>
    )
}
