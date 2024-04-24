import {useEffect, useState} from "react";
import {instance} from "../../services/backend-api/axiosConfig.ts";
import {Ibom} from "../../types.ts";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";

interface Props {
    isOpen: () => void,
}



export const ManufacturingCreationModal: React.FC<Props> = ({isOpen}) => {
    const [availableBoms, setAvailableBoms] = useState([])
    const [newOrderBomId, setNewOrderBomId] = useState("")
    const [newOrderQuantity, setNewOrderQuantity] = useState(0)
    const [newOrderDueDate, setNewOrderDueDate] = useState<Date | null>(null)



    console.log("mounted")


    const handleManuOrderCreation = async () => {
        const newManuOrderData = {
            bomId: newOrderBomId,
            quantity: newOrderQuantity.valueOf(),
            dueDate: newOrderDueDate
        }

        try {
            await instance.post(`/manuOrder`, newManuOrderData)
            isOpen()
        } catch {
            console.error("Could to create Manufacturing order")
        }

    }

    useEffect(() => {
        fetchAvailableBoms()
    }, []);

    const fetchAvailableBoms = async () => {
            console.log("fetchAvailableBoms")
            instance.get('/bom/findAll').then(response => {
                setAvailableBoms(response.data)
            }).catch(error => {
            console.log(error.message)}
            )
    }

    return (
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
            <h1>Create a Manufacturing order</h1>
            <form className={"space-y-4"}>
                <div>
                    <h1>BOM:</h1>
                    <select
                        value={newOrderBomId}
                        onChange={(e) => setNewOrderBomId(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Select a BOM</option>
                        {availableBoms.map((bom: Ibom) => (
                            <option key={bom._id} value={bom._id}>
                                {bom.name}
                            </option>
                        ))}
                    </select>
                </div>
                <h1>Quantity</h1>
                <Input value={newOrderQuantity}
                       onChange={(e) => setNewOrderQuantity(e.target.valueAsNumber)} type={"number"}/>
                <div>
                    <h1>Due Date</h1>
                    <Input
                        placeholder="Date"
                        onChange={(e) => setNewOrderDueDate(e.target.valueAsDate)}
                        type={"date"}
                    />
                </div>
                <Button onClick={() => handleManuOrderCreation()}>Create</Button>


            </form>
        </Sheet>
    )
}