import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Iitems} from "../../types.ts";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import {instance} from "../../services/backend-api/axiosConfig.ts";


export function Item() {
    const [itemData, setItemData] = useState<Iitems | null>(null);
    const { item } = useParams();

    useEffect(() => {
    fetchItemData()
    }, [item]);

    const fetchItemData = async () => {
        const response = await instance.get(`/item/findById/${item}`);
        setItemData(response.data);
    };
    return (
        <div className={"mx-auto w-fit mt-6 space-y-6"}>
            <div className={"flex space-x-2"}>
                <h1 className={"text-2xl text-[#50A6A1]"}>Item</h1>

                <h1 className={"text-2xl text-gray-500"}>{itemData?.name}</h1>
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

                {itemData && (
                    <Table className={"z-30 max-w-[50vw]"}>
                        <tbody>
                        <tr>
                            <td>Name</td>
                            <td>{itemData?.name}</td>
                        </tr>
                        <tr>
                            <td>Description</td>
                            <td>{itemData?.description}</td>
                        </tr>
                        <tr>
                            <td>Stock</td>
                            <td>{itemData.stock}</td>

                        </tr>


                        <tr>
                            <td>ID</td>
                            <td>{itemData._id}</td>
                        </tr>
                        </tbody>
                    </Table>
                )}
            </Sheet>
        </div>
    )
}