import Table from "@mui/joy/Table";
import axios from "axios";
import { useEffect, useState } from "react";
import { Ibom } from "../types";
import Modal from 'react-modal';
import Button from "@mui/joy/Button";


export const ListAllBoms = () => {
const [boms, setBoms] = useState([])
const [selectedBom, setSelectedBom] = useState<Ibom | null>(null)
const [isModalOpen, setIsModalOpen] = useState(false)


const handleBomClick = (bom: Ibom) => {
    setSelectedBom(bom);
    setIsModalOpen(true)
}
const handleCloseModal = () => {
    setIsModalOpen(false)
}

const handleBomDelete = async (id: string | undefined) => {
    if (typeof id === "undefined") {
        console.warn("Cannot find BOM")
    } else {
        await axios.delete(`http://localhost:3000/bom/deleteById/${id}`)
        fetchBoms()
    }
}

useEffect(() => {
    fetchBoms();
}, []);

    const fetchBoms = async () => {
        const response = await axios.get('http://localhost:3000/bom/findAll');
        setBoms(response.data);
    };

    return(
        <>
            <div className="flex w-screen justify-center mt-12">
                <Table className={"max-w-[50%]"}>
                <caption>BOMs</caption>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Product</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                    {boms.map((bom: Ibom) => (
                        <tr key={bom._id}>
                            <td onClick={() => handleBomClick(bom)}>{bom.name}</td>
                            <td>{bom.product}</td>
                            <td onClick={() => handleBomDelete(bom._id)}>Delete</td>

                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            contentLabel="BOM Details"
            className={"bg-gray-200 w-fit p-12 mx-auto h-fit rounded-2xl mt-36 space-y-6"}
            >
            <Button variant={"solid"} onClick={handleCloseModal}> Close</Button>
            {selectedBom && (
                <Table className={"z-30 max-w-[50vw]"}>
                    <tr>
                        <td>Name</td>
                        <td>{selectedBom.name}</td>
                    </tr>
                    <tr>
                        <td>Product</td>
                        <td>{selectedBom.product}</td>
                    </tr>
                    <tr>
                        <td>Components</td>
                        {selectedBom.components && selectedBom.components.map((component, index) => (
                                        <div key={index}>{component.id} - {component.amount}</div>
                                    ))}
                    </tr>

                </Table>

            )}
            </Modal>
            </div>
        </>
    )
}