import { ListItemButton, Modal, Sheet, Table } from "@mui/joy";
import { Icustomer } from "../types";
import { useEffect, useState } from "react";
import axios from "axios";

export function Customer() {
const [customers, setCustomers] = useState([])
const [selectedCustomer, setSelectedCustomer] = useState<Icustomer | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false)


const handleCustomerClick = (customer: Icustomer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true)
}

useEffect(() => {
    fetchCustomers();
}, []);


    const fetchCustomers = async () => {
        const response = await axios.get('http://localhost:3000/customer/findAll');
        setCustomers(response.data);
    };

    
    return (
        <div className=" max-w-[80%] mx-auto">
        <div className=" mx-auto justify-center mt-6">
            <div>
                <h1>Customers</h1>
            </div>
        <div className=" w-[50%]">
            <Table
                variant="outlined"
            >

            {customers.map((customer: Icustomer) => (
                <tr key={customer._id}>
                    <td onClick={() => handleCustomerClick(customer)}>{customer.name}</td>
                  </tr>
                  ))}
            </Table>
            <Modal
                        aria-labelledby="modal-title"
                        aria-describedby="modal-desc"
                        open={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
            >
                <Sheet
                              variant="outlined"
                              className="space-y-10"
                              sx={{
                                maxWidth: 750,
                                borderRadius: "md",
                                p: 3,
                                boxShadow: "lg",
                                
                              }}
                >
                    <Table>
                    <thead>
                        <tr>
                        <th style={{ width: '20%' }}>Customer</th>
                        <th style={{ width: '80%' }}>{selectedCustomer?.name}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Mail</td>
                            <td>{selectedCustomer?.mailAdress}</td>
                        </tr>
                        <tr>
                            <td>Phone nr.</td>
                            <td>{selectedCustomer?.phoneNr}</td>
                        </tr>
                        <tr>
                            <td>ID</td>
                            <td>{selectedCustomer?._id}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Street</td>
                            <td>{selectedCustomer?.address.street}</td>
                        </tr>
                        <tr>
                            <td>Zip</td>
                            <td>{selectedCustomer?.address.zip}</td>
                        </tr>
                        <tr>
                            <td>City</td>
                            <td>{selectedCustomer?.address.city}</td>
                        </tr>
                        <tr>
                            <td>Country</td>
                            <td>{selectedCustomer?.address.country}</td>
                        </tr>
                        </tbody>
                    </Table>
                </Sheet>

            </Modal>
            </div>
        </div>
        </div>
    )
}