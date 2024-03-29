import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import axios from "axios";
import { useEffect, useState } from "react";
import { Iorder } from "../types";

export function Orders() {
    const [orders, setOrders] = useState([])
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false)
    const [newOrderDueDate, setNewOrderDueDate] = useState<Date | null> (null)
    const [newOrderRecepian, setNewOrderReceptian] = useState("")


const handleSubmitNewOrder = async () => {
    const orderData = {
        orderNumber: 3,
        receptian: newOrderRecepian,
        dueDate: newOrderDueDate
    
    }
    await axios.post('http://localhost:3000/orders/create', orderData)
    fetchOrders()
    setIsCreationModalOpen(false)
    setNewOrderDueDate(null)
    setNewOrderReceptian("")

}

useEffect(() => {
    fetchOrders();
}, []);

const fetchOrders = async () => {
    const response = await axios.get('http://localhost:3000/orders/findAll');
    setOrders(response.data);
};


    return (
        <>
        <h1 className="text-center mt-6">Orders</h1>
        <div className="flex w-screen justify-center mt-12">
        <Table 
        borderAxis="both"
        className={"max-w-[50%]"}>
            <thead>
                <tr>
                    <td>#</td>
                    <td>Status</td>
                    <td>Due date</td>
                </tr>
            </thead>
            <tbody>
                {orders.map((order: Iorder) => (
                    <tr key={order._id}>
                        <td>{order.orderNumber}</td>
                        <td>{order.receptian}</td>
                    </tr>
                    
                ))}
            </tbody>
        </Table>
        <Button onClick={() => setIsCreationModalOpen(true)}>Open</Button>
        <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={isCreationModalOpen}
                onClose={() => setIsCreationModalOpen(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <Sheet
                      variant="outlined"
                      sx={{
                        maxWidth: 500,
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',}}
            >
            <form>
                 <Input
                type="text"
                placeholder="Recepian"
                value={newOrderRecepian}
                onChange={(e) => setNewOrderReceptian(e.target.value)}
                />                
                <Input
                type="date"
                placeholder="Date"
                onChange={(e) => setNewOrderDueDate(e.target.valueAsDate)}
                />
                {newOrderDueDate != null && (
                    <h2>{newOrderDueDate.getTime() / 1000}</h2>

                )
                }
                <Button onClick={handleSubmitNewOrder}>Submit</Button>
                </form>
            </Sheet>
        </Modal>
        </div>
        </>
    )
}