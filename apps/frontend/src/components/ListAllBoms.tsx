import Table from "@mui/joy/Table";
import axios from "axios";
import { useEffect, useState } from "react";
import { Ibom } from "../types";


export const ListAllBoms = () => {
const [boms, setBoms] = useState([])

useEffect(() => {
    fetchBoms();
}, []);

    const fetchBoms = async () => {
        const response = await axios.get('http://localhost:3000/bom/findAll');
        setBoms(response.data);
    };

    return(
        <>
                <Table className={"max-w-[50%]"}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Product</th>
                </tr>
                </thead>
                <tbody>
                    {boms.map((bom: Ibom) => (
                        <tr key={bom._id}>
                            <td>{bom.name}</td>
                            <td>{bom.product}</td>

                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}