import Table from "@mui/joy/Table";
import {useEffect, useState} from "react";
import {Ibom, Icomponent, Iitems} from "../types.ts";
import Modal from 'react-modal';
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Input from "@mui/joy/Input";
import ChipDelete from "@mui/joy/ChipDelete";
import Sheet from "@mui/joy/Sheet";
import {instance} from "../services/backend-api/axiosConfig.ts";
import {Alert, CircularProgress} from "@mui/joy";
import {Link, useSearchParams} from "react-router-dom";
import {AlertMessage, Ialert} from "../components/AlertMessage.tsx";
import {BomCreationModal} from "../components/Bom/BomCreationModal.tsx";
import {ArrowsPointingOutIcon} from "@heroicons/react/16/solid";
import {BodySheet} from "../components/BodySheet.tsx";


export const Boms = () => {
    const [boms, setBoms] = useState<Ibom[]>([])
    const [selectedBom, setSelectedBom] = useState<Ibom | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false)
    const [newBomName, setNewBomName] = useState("")
    const [newBomProduct, setNewBomProduct] = useState("")
    const [selectedComponent, setSelectedComponent] = useState<Icomponent | null>(null)
    const [newComponentAmount, setNewComponentAmount] = useState(0)
    const [addComponentForm, setAddComponentForm] = useState(false)
    const [newComponentId, setNewComponentId] = useState("")
    const [availableComponents, setAvailableComponents] = useState<Iitems[]>([]); // State for available components
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchParams, setSearchParams] = useSearchParams();
    const [alert, setAlert] = useState<Ialert>({open: false, text: '', severity: "success"})


    const handleSearchParams = () => {
        if (searchParams) {
            const search = searchParams.get("id")
            if (search && boms.length > 0) {
                const bom = boms.find(bom => bom._id === search)
                if (bom) {
                    handleBomClick(bom)

                }
            }
        }
    }

    const handleMessageClose = () => {
        setAlert({...alert, open: false});
    }

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
        if (bomCopy._id !== undefined) {
            setSearchParams({id: bomCopy._id})
        }
        setIsModalOpen(true);
    };


    const handleAddBomClick = () => {
        setIsCreationModalOpen(true)
    }

    const handleCloseModal = () => {
        setSearchParams()
        setIsModalOpen(false)
        setAddComponentForm(false)
    }

    const handleAddBomModalClose = () => {
        setIsCreationModalOpen(false)
    }


    const handleBomDelete = async (id: string | undefined) => {
        if (typeof id === "undefined") {
            console.warn("Cannot find BOM")
            return
        }
        instance.delete(`/bom/${id}`).then(response => {
            setAlert({
                severity: "danger",
                text: response.data.message,
                open: true
            })
            fetchBoms()
        }).catch(error => {
            setAlert({
                severity: "danger",
                text: error.message || JSON.stringify(error),
                open: true
            })
        })

    }

    const handleSubmitNewBom = async () => {
        const bomData = {
            name: newBomName,
            product: newBomProduct
        };
        instance.post('/bom', bomData).then(response => {
            setAlert({
                severity: "success",
                text: response.data.message,
                open: true
            })
            fetchBoms()
            setNewBomName('')
            setIsCreationModalOpen(false)
        }).catch(error => {
            setAlert({
                severity: "danger",
                text: error.message || JSON.stringify(error),
                open: false
            })
        })

    };

    const handleSubmitNewComponent = async (id: string | undefined) => {
        if (id === "undefined") {
            console.warn("Cannot find BOM")
            return
        }
        const componentData = {componentId: newComponentId, componentAmount: newComponentAmount}
        instance.post(`/bom/${id}/component`, componentData).then(response => {
            setAlert({
                severity: "success",
                text: response.data.message,
                open: true
            })
            fetchBoms()
            setNewComponentId("")
            setNewComponentAmount(0)
            setAddComponentForm(false)
        })
            .catch(error => console.error("Failed to add component:", error));

    }

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
            fetchBoms();

        }).catch(error => {
            setAlert({
                severity: "danger",
                text: error.message || JSON.stringify(error),
                open: true
            })
        })
    }

    const handleComponentAmountChange = async (id: string | undefined) => {
        if (id === undefined) {
            console.warn('Cannot set stock of an item without an id')
            return
        }

        await instance.patch(`/bom/setComponentAmount/${id}/${selectedComponent?.id}/${newComponentAmount}`);
        setIsModalOpen(false)
        fetchBoms();
        setNewComponentAmount(0)
        setSelectedBom(null)
        setSelectedComponent(null)

    }


    const findProductsName = (bom: Ibom) => {
        const item = availableComponents.find(availableComponents => availableComponents._id === bom.product)
        if (item !== undefined) {
            return item.name
        } else {
            return bom.product
        }
    }

    useEffect(() => {
        fetchBoms();
        fetchAvailableComponents();
    }, []);


    useEffect(() => {
        handleSearchParams()
    }, [boms]);

    const fetchBoms = async () => {
        console.log("fetchBoms")
        instance.get('/bom').then(response => {
            setBoms(response.data)
            setLoading(false)
        }).catch(error => setError(error))
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

    const fetchComponentNameById = async (componentId: string | undefined) => {
        console.log("fetchComponentNameById", componentId)
        try {
            if (!componentId) {
                console.error('No component id provided')
            }
            return instance.get(`/item/${componentId}`).then(response => {
                console.log(response.data.name)
                return response.data.name
            }).catch(error => setError(error))
        } catch {
            console.error("Failed to fetch component name:");
            return "";
        }
    };

    return (
        <>
            <BodySheet>
                <AlertMessage alertContent={alert} onClose={() => handleMessageClose()}/>
                <h1 className="text-xl mb-12">BOMs</h1>
                {error && <Alert color={"danger"} variant={"solid"}>{error}</Alert>}
                {loading && (
                    <CircularProgress/>

                )}
                <div>
                    <Table borderAxis={"both"}>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Product</th>
                            <th><Button variant={"outlined"}
                                        onClick={handleAddBomClick}>Create</Button>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {boms.map((bom: Ibom) => (
                            <tr key={bom._id}>
                                <td onClick={() => handleBomClick(bom)}
                                    className=" underline cursor-pointer select-none">{bom.name}</td>
                                <td>{findProductsName(bom)}</td>
                                <td>{bom._id && !isModalOpen && !isCreationModalOpen &&
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
                        onRequestClose={() => handleCloseModal()}
                        contentLabel="BOM Details"
                        className={"bg-gray-200 w-fit p-12 mx-auto h-fit rounded-2xl mt-28 space-y-6 focus:outline-none"}
                    >
                        <div className={"flex justify-between"}>
                            <div className={"flex space-x-2"}>

                                <h1 className={"text-[#50A6A1] text-2xl"}>BOM</h1>
                                <h1 className={"text-2xl text-gray-500"}>{selectedBom?.name}</h1>

                            </div>
                            <div>
                                <Link to={`/bom/${selectedBom?._id}`}><ArrowsPointingOutIcon
                                    className={"h-6 w-6 text-gray-500 my-auto"}/></Link>
                            </div>
                        </div>
                        <div className={"flex space-x-2"}>
                            <Button onClick={() => handleBomDelete(selectedBom?._id)} color={"danger"}
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

                            {selectedBom && (
                                <Table className={"z-30 max-w-[50vw]"}>
                                    <tbody>
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
                                        <td>{findProductsName(selectedBom)}</td>
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
                                    variant={"outlined"}
                                    onClick={() => setAddComponentForm(true)}>
                                    Add</Button>
                            </div>
                            {selectedBom && (
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
                                    {selectedBom.components && selectedBom.components.map((component, index) => (
                                        <tr key={index}>
                                            <td>{component.name || component.id}</td>

                                            {selectedComponent?.id === component.id ? (
                                                    <td>
                                                        <form className={"flex"}><Input
                                                            type="number"
                                                            placeholder="Value"
                                                            size="md"
                                                            variant="outlined"
                                                            value={newComponentAmount}
                                                            onChange={(e) => setNewComponentAmount(Number(e.target.value))}


                                                        ></Input>
                                                            <Button variant='outlined' size="sm" type='button'
                                                                    onClick={() => handleComponentAmountChange(selectedBom._id)}>Change</Button>
                                                            <Button variant="outlined" size="sm" typeof="button"
                                                                    onClick={() => setSelectedComponent(null)}>X</Button>

                                                        </form>

                                                    </td>

                                                ) :
                                                (<td className=" text-gray-400"><Chip
                                                    onClick={() => setSelectedComponent(component)}
                                                    variant="outlined">{component.amount}</Chip></td>)
                                            }
                                            <td>
                                                <Button
                                                    onClick={() => handleRemoveComponent(selectedBom._id, component.id)}>
                                                    Remove</Button>

                                            </td>
                                        </tr>

                                    ))}

                                    {addComponentForm && (
                                        <tr>
                                            <td>
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
                                            </td>
                                            <td>

                                                <Input
                                                    type="number"
                                                    placeholder="Value"
                                                    variant="outlined"
                                                    value={newComponentAmount}
                                                    onChange={(e) => setNewComponentAmount(Number(e.target.value))}
                                                />
                                            </td>
                                            <td className={"space-x-1"}>
                                                <Button
                                                    onClick={() => handleSubmitNewComponent(selectedBom._id)}>Add</Button>
                                                <Button
                                                    onClick={() => setAddComponentForm(false)}>X</Button>

                                            </td>


                                        </tr>

                                    )}

                                    </tbody>
                                </Table>
                            )}
                        </Sheet>
                    </Modal>
                    <BomCreationModal open={isCreationModalOpen} onRequestClose={handleAddBomModalClose}
                                      value={newBomName} onChange={(e) => setNewBomName(e.target.value)}
                                      value1={newBomProduct} onChange1={(e) => setNewBomProduct(e)}
                                      onClick={handleSubmitNewBom} availableComponents={availableComponents}
                    />
                </div>
            </BodySheet>

        </>
    )
}
