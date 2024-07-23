import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import {Ibom    } from "../../types.ts";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {instance} from "../../services/backend-api/axiosConfig.ts";

export const Bom = () => {
    const [bomData, setBomData] = useState<Ibom | null>(null);
    const { bom } = useParams();

    useEffect(() => {
        fetchBomData()
    }, [bom]);

    const fetchBomData = async () => {
        console.log(bom)
        const response = await instance.get(`/bom/${bom}`);
        console.log(response.data)
        setBomData(response.data);
    };

    return (
        <div className={"mx-auto w-fit mt-6 space-y-6"}>
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
                            {/*<td>{findProductsName(bomData)}</td>*/}
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

                            </tr>

                        ))}







                        </tbody>
                    </Table>
                )}
            </Sheet>

        </div>
    )
}
