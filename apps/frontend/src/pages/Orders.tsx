import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import axios from "axios";
import { useEffect, useState } from "react";
import { Iitems, Iorder } from "../types";
import Chip from "@mui/joy/Chip";
import { CheckBadgeIcon } from "@heroicons/react/16/solid";
import ChipDelete from "@mui/joy/ChipDelete";

export function Orders() {
    const [orders, setOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState<Iorder | null>(null)
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false)
    const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false)
    const [newOrderDueDate, setNewOrderDueDate] = useState<Date | null> (null)
    const [newOrderRecepian, setNewOrderReceptian] = useState("")
    const [newItemToAddAmount, setNewItemToAddAmount] = useState(0)
    const [newItemToAddId, setNewItemToAddId] = useState("")
    const [availableItems, setAvailableItems] = useState([]); // State for available components
    const [isAddItemForm, setIsAddItemForm] = useState(false)




    const handleAddNewItem = async (orderId: string | undefined) => {      
        if (!selectedOrder || !newItemToAddAmount) {
          alert("Please fill in all fields.");
          return;
        }
      
        const newItemData = {
            itemId: newItemToAddId,
            amount: newItemToAddAmount
        };
      
        try {
          await axios.patch(`http://localhost:3000/orders/${orderId}/additem`, newItemData);
          fetchOrders();
          setNewItemToAddAmount(0);
          setNewItemToAddId("")
          setIsOrdersModalOpen(false);
        } catch (error) {
          console.error("Failed to add item:", error);
        }
      };
      

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

const handleOrderClick = (order: Iorder) => {
    setSelectedOrder(order);
    setIsOrdersModalOpen(true)
}

const handleMarkAsDone = async (id: string | undefined) => {
    // Send a DELETE request
    if (typeof id === 'undefined') {
        console.warn('Cannot delete an item without an id');
        return;
    }
    await axios.patch(`http://localhost:3000/orders/markAsDone/${id}`);
    // After deleting the item, fetch items again to refresh the list
    fetchOrders();
};
const handleDelete = async (id: string | undefined) => {
    // Send a DELETE request
    if (typeof id === 'undefined') {
        console.warn('Cannot delete an item without an id');
        return;
    }
    await axios.delete(`http://localhost:3000/orders/delete/${id}`);
    // After deleting the item, fetch items again to refresh the list
    fetchOrders();
};

useEffect(() => {
    fetchOrders();
    fetchAvailableItems()
}, []);

const fetchOrders = async () => {
    const response = await axios.get('http://localhost:3000/orders/findAll');
    setOrders(response.data);
};

const fetchAvailableItems = async () => {
    // Example API call
    const response = await axios.get('http://localhost:3000/item/findAll');
    setAvailableItems(response.data); // Assuming response.data contains an array of components
};


    return (
      <>
        <h1 className="text-center mt-6">Orders</h1>
        <div className="flex w-screen justify-center mt-12">
          <Table borderAxis="both" className={"max-w-[50%]"}>
            <thead>
              <tr>
                <td>#</td>
                <td>Recepian</td>
                <td>Due date</td>
                <td>Status</td>
                <td>
                  <Button onClick={() => setIsCreationModalOpen(true)}>
                    Add Order
                  </Button>
                </td>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: Iorder) => (
                <tr key={order._id}>
                  <td onClick={() => handleOrderClick(order)}>
                    {order.orderNumber}
                  </td>
                  <td>{order.receptian}</td>
                  <td>{new Date(order.dueDate).toLocaleDateString()}</td>
                  {order.isDone && (
                    <td>
                      <Chip color="success">Done!</Chip>
                    </td>
                  )}
                  {!order.isDone && (
                    <td>
                      <Chip
                        onClick={() => handleMarkAsDone(order._id)}
                        endDecorator={
                          <CheckBadgeIcon className="h-3 w-3 text-black" />
                        }
                      >
                        Not done!
                      </Chip>
                    </td>
                  )}
                  {order.isDone === null && <td>Null</td>}
                  <td>
                    {" "}
                    <Chip
                      variant="soft"
                      color="danger"
                      size="sm"
                      className={"select-none"}
                      endDecorator={
                        <ChipDelete onClick={() => handleDelete(order._id)} />
                      }
                    >
                      Delete
                    </Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={isCreationModalOpen}
            onClose={() => setIsCreationModalOpen(false)}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Sheet
              variant="outlined"
              sx={{
                maxWidth: 500,
                borderRadius: "md",
                p: 3,
                boxShadow: "lg",
              }}
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
                )}
                <Button onClick={handleSubmitNewOrder}>Submit</Button>
                <Button
                  onClick={() => setIsCreationModalOpen(false)}
                  color="danger"
                  variant="outlined"
                >
                  Cancel
                </Button>
              </form>
            </Sheet>
          </Modal>
          <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={isOrdersModalOpen}
            onClose={() => setIsOrdersModalOpen(false)}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Sheet
              variant="outlined"
              sx={{
                maxWidth: 750,
                borderRadius: "md",
                p: 3,
                boxShadow: "lg",
              }}
            >
              <Table>
              <tr>
                <td>#</td>
                <td>{selectedOrder?.orderNumber}</td>
            </tr>               
            <tr>
                <td>ID</td>
                <td>{selectedOrder?._id}</td>
            </tr>
            <tr>
                <td>Recepian</td>
                <td>{selectedOrder?.receptian}</td>
            </tr>
            <tr>
            <td>
              {selectedOrder && selectedOrder.items && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item, index) => (
                  <tr key={item._id}>
                    <td>Item {index + 1}</td>
                    <td>ID {item._id} </td>
                    <td>Amount: {item.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>No items</tr>
              )}

            </td>
            </tr>
            <tr>
                        {isAddItemForm && (
                        <td className="flex">
                            <form>
                                <select
                                    value={newItemToAddId}
                                    onChange={(e) => setNewItemToAddId(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md"
                                    >
                                    <option value="">Select a Component</option>
                                    {availableItems.map((item: Iitems) => (
                                        <option key={item._id} value={item._id}>
                                            {item.name}
                                        </option>
                                    ))}
                                    </select>
                                    <input
                                    type="number"
                                    value={newItemToAddAmount}
                                    onChange={(e) => setNewItemToAddAmount(e.target.valueAsNumber)}
                                    />
                        </form > <Button onClick={() => handleAddNewItem(selectedOrder?._id)}>Add</Button>
                        <Button onClick={() => setIsAddItemForm(false)}>X</Button>
                        </td>
                        
                        )}
                    </tr>
                    <tr>
                        <td>                <td><Button onClick={() => setIsAddItemForm(true)}>Add</Button></td>
</td>
                    </tr>
</Table>
            </Sheet>
          </Modal>
        </div>
      </>
    );
}