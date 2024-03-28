import Table from "@mui/joy/Table";
import axios from "axios";
import { useEffect, useState } from "react";
import { Ibom, Icomponent } from "../types";
import Modal from 'react-modal';
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Input from "@mui/joy/Input";


export const ListAllBoms = () => {
const [boms, setBoms] = useState([])
const [selectedBom, setSelectedBom] = useState<Ibom | null>(null)
const [isModalOpen, setIsModalOpen] = useState(false)
const [isCreationModalOpen, setIsCreationModalOpen] = useState(false)
const [newBomName, setNewBomName] = useState(" ")
const [newBomProduct, setNewBomProduct] = useState(" ")
const [selectedComponent, setSelectedComponent] = useState<Icomponent | null> (null)
const [newComponentAmount, setNewComponentAmount] = useState(0)



const handleBomClick = (bom: Ibom) => {
    setSelectedBom(bom);
    setIsModalOpen(true)
}


const handleAddBomClick = () => {
    setIsCreationModalOpen(true)
}

const handleCloseModal = () => {
    setIsModalOpen(false)
}

const handleAddBomModalClose = () => {
    setIsCreationModalOpen(false)
}

const handleBomDelete = async (id: string | undefined) => {
    if (typeof id === "undefined") {
        console.warn("Cannot find BOM")
        return
    }
    await axios.delete(`http://localhost:3000/bom/delete/${id}`)
    fetchBoms()
    
}

const handleSubmitNewBom = async () => {
    const bomData = {
        name: newBomName,
        product: newBomProduct
    };
    await axios.post('http://localhost:3000/bom/create', bomData);
    // After creating new item, fetch items again to refresh the list
    fetchBoms();
    // Hide form and reset values
    setIsCreationModalOpen(false);
    setNewBomName('');
};

const handleComponentAmountChange = async (id: string | undefined) => {
    if (typeof id === undefined) {
        console.warn('Cannot set stock of an item without an id')
        return
    } 
    
    await axios.patch(`http://localhost:3000/bom/setComponentAmount/${id}/${selectedComponent?.id}/${newComponentAmount}`);
    setIsModalOpen(false)
    fetchBoms();
    setNewComponentAmount(0)
    setSelectedBom(null)
    setSelectedComponent(null)

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
                            <td onClick={() => handleBomClick(bom)} className=" underline cursor-pointer select-none">{bom.name}</td>
                            <td>{bom.product}</td>
                            <td>{bom._id && 
                            <Button
                                onClick={() => handleBomDelete(bom._id)}
                            >
                             Delete   </Button>
                            }
                            </td>

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
                                        <tr key={index}>
                                           <td >{component.id}</td> 
                                           <td className=" text-gray-400"><Chip onClick={() => setSelectedComponent(component)} variant="outlined">{component.amount}</Chip></td>
                                           {selectedComponent?.id === component.id &&
                                           <td><form><Input 
                                           type="number" 
                                           placeholder="Value"
                                           size="md"
                                           variant="outlined"
                                           value={newComponentAmount} 
                                           onChange={(e) => setNewComponentAmount(Number(e.target.value))}
                                        
                                           
                                           ></Input>
                                            <Button variant='outlined' size="sm" type='button' onClick={() => handleComponentAmountChange(selectedBom._id)}>Change</Button>
                                            <Button variant="outlined" size="sm" typeof="button" onClick={() => setSelectedComponent(null)}>X</Button>

                                           </form></td>
                                           }
                                           
                                           </tr>

                                    ))}
                    </tr>

                </Table>

            )}
            </Modal>
            <Modal
            isOpen={isCreationModalOpen}
            onRequestClose={handleAddBomModalClose}
            contentLabel="Create BOM"
            className={"bg-gray-200 w-fit p-12 mx-auto h-fit rounded-2xl mt-36 space-y-6"}
            >
                <form>
                    <h2>Name</h2>
                    <Input 
                     type="text"
                     placeholder="Bom name"
                     size="md"
                     variant="outlined"
                     value={newBomName}
                     onChange={(e) => setNewBomName(e.target.value)}
                    />
                    <h2>Product</h2>
                    <Input 
                     type="text"
                     placeholder="Bom product"
                     size="md"
                     variant="outlined"
                     value={newBomProduct}
                     onChange={(e) => setNewBomProduct(e.target.value)}
                    />
                                <Button onClick={handleSubmitNewBom}>Create</Button>
                </form>

            </Modal>
            <Button onClick={handleAddBomClick} className=" max-h-5">Create</Button>
            </div>
        </>
    )
}