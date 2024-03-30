import Table from "@mui/joy/Table";
import axios from "axios";
import {useEffect, useState} from "react";
import {Ibom, Icomponent, Iitems} from "../types";
import Modal from 'react-modal';
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Input from "@mui/joy/Input";
import {XMarkIcon} from "@heroicons/react/16/solid";
import IconButton from "@mui/joy/IconButton";
import FormLabel from "@mui/joy/FormLabel";
import ChipDelete from "@mui/joy/ChipDelete";


export const ListAllBoms = () => {
    const [boms, setBoms] = useState([])
    const [selectedBom, setSelectedBom] = useState<Ibom | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false)
    const [newBomName, setNewBomName] = useState(" ")
    const [newBomProduct, setNewBomProduct] = useState(" ")
    const [selectedComponent, setSelectedComponent] = useState<Icomponent | null>(null)
    const [newComponentAmount, setNewComponentAmount] = useState(0)
    const [addComponentForm, setAddComponentForm] = useState(false)
    const [newComponentId, setNewComponentId] = useState(" ")
    const [availableComponents, setAvailableComponents] = useState([]); // State for available components


    const handleBomClick = async (bom: Ibom) => {
        // Create a copy of the bom object to avoid directly mutating state
        const bomCopy = {...bom, components: [...bom.components]};

        // Fetch component names in parallel
        const componentNamesPromises = bomCopy.components.map(async (component) => {
            const name = await fetchComponentNameById(component.id);
            return {...component, name}; // Create a new component object including the name
        });

        // Wait for all promises to resolve
        bomCopy.components = await Promise.all(componentNamesPromises);

        setSelectedBom(bomCopy);
        setIsModalOpen(true);
    };

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

    const handleSubmitNewComponent = async (id: string | undefined) => {
        if (typeof id === "undefined") {
            console.warn("Cannot find BOM")
            return
        }
        const componentData = {componentId: newComponentId, componentAmount: 2}
        await axios.patch(`http://localhost:3000/bom/AddComponent/${id}`, componentData)
            .catch(error => console.error("Failed to add component:", error));
        fetchBoms()
        setNewComponentId(" ")
        setAddComponentForm(false)
    }

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
        fetchAvailableComponents(); // Assuming you have a function to fetch available components
    }, []);

    const fetchBoms = async () => {
        const response = await axios.get('http://localhost:3000/bom/findAll');
        setBoms(response.data);
    };

    const fetchAvailableComponents = async () => {
        // Example API call
        const response = await axios.get('http://localhost:3000/item/findAll');
        setAvailableComponents(response.data); // Assuming response.data contains an array of components
    };

    const fetchComponentNameById = async (componentId: string | undefined) => {
        try {
            const response = await axios.get(`http://localhost:3000/item/getNameById/${componentId}`);
            console.log(response.data)
            return response.data; // Assuming the endpoint returns an object with a name property
        } catch (error) {
            console.error("Failed to fetch component name:", error);
            return ""; // Return a default string in case of an error
        }
    };

    return (
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
                            <td onClick={() => handleBomClick(bom)}
                                className=" underline cursor-pointer select-none">{bom.name}</td>
                            <td>{bom.product}</td>
                            <td>{bom._id &&
                                <Chip
                                    variant="soft"
                                    color="danger"
                                    size="sm"
                                    className={"select-none"}
                                    endDecorator={<ChipDelete onClick={() => handleBomDelete(bom._id)}/>}
                                >
                                    Delete </Chip>
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
                                <td>BOM ID</td>
                                <td>{selectedBom._id}</td>
                            </tr>
                            <tr>
                                <td>Name</td>
                                <td>{selectedBom.name}</td>
                            </tr>
                            <tr>
                                <td>Product</td>
                                <td>{selectedBom.product}</td>
                            </tr>
                            <tr>
                                <td>Components <Button onClick={() => setAddComponentForm(true)}>Add</Button></td>
                                {selectedBom.components && selectedBom.components.map((component, index) => (
                                    <tr key={index}>
                                        <td>{component.name || component.id}</td>
                                        <td className=" text-gray-400"><Chip
                                            onClick={() => setSelectedComponent(component)}
                                            variant="outlined">{component.amount}</Chip></td>
                                        {selectedComponent?.id === component.id &&
                                            <td>
                                                <form><Input
                                                    type="number"
                                                    placeholder="Value"
                                                    size="md"
                                                    variant="outlined"
                                                    value={newComponentAmount}
                                                    onChange={(e) => setNewComponentAmount(Number(e.target.value))}


                                                ></Input>
                                                    <Button variant='outlined' size="sm" type='button'
                                                            onClick={() => handleComponentAmountChange(selectedBom._id)}>Change</Button>
                                                    <IconButton variant="outlined" size="sm" typeof="button"
                                                                onClick={() => setSelectedComponent(null)}><XMarkIcon
                                                        className="h-6 w-6 text-blue-500"/></IconButton>

                                                </form>
                                            </td>
                                        }

                                    </tr>

                                ))}
                            </tr>
                            <tr>
                                {addComponentForm && (
                                    <td className="flex">
                                        <form>
                                            <select
                                                value={newComponentId}
                                                onChange={(e) => setNewComponentId(e.target.value)}
                                                className="p-2 border border-gray-300 rounded-md"
                                            >
                                                <option value="">Select a Component</option>
                                                {availableComponents.map((component: Iitems) => (
                                                    <option key={component._id} value={component._id}>
                                                        {component.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </form>
                                        <Button onClick={() => handleSubmitNewComponent(selectedBom._id)}>Add</Button>
                                        <Button onClick={() => setAddComponentForm(false)}>X</Button>
                                    </td>

                                )}
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
                    <h2>Create new BOM</h2>
                    <form>
                        <FormLabel>Name</FormLabel>
                        <Input
                            type="text"
                            placeholder="Bom name"
                            size="md"
                            variant="outlined"
                            value={newBomName}
                            onChange={(e) => setNewBomName(e.target.value)}
                        />
                        <FormLabel>Product</FormLabel>
                        <Input
                            type="text"
                            placeholder="Bom product"
                            size="md"
                            variant="outlined"
                            value={newBomProduct}
                            onChange={(e) => setNewBomProduct(e.target.value)}
                        />
                    </form>
                    <Button onClick={handleSubmitNewBom}>Create</Button>
                </Modal>
                <Button onClick={handleAddBomClick} className=" max-h-5">Create</Button>
            </div>
        </>
    )
}