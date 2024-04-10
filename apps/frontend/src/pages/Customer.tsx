import {Button, CardContent, Input, Modal, Sheet, Table, Typography} from "@mui/joy";
import {Icustomer} from "../types";
import {useEffect, useState} from "react";
import axios from "axios";
import Card from "@mui/joy/Card";

export function Customer() {
    const [customers, setCustomers] = useState([])
    const [selectedCustomer, setSelectedCustomer] = useState<Icustomer | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newCustomerName, setNewCustomerName] = useState('');
    const [newCustomerEmail, setNewCustomerEmail] = useState('');
    const [newCustomerPhone, setNewCustomerPhone] = useState('');
    const [newCustomerStreet, setNewCustomerStreet] = useState('');
    const [newCustomerZip, setNewCustomerZip] = useState('');
    const [newCustomerCity, setNewCustomerCity] = useState('');
    const [newCustomerCountry, setNewCustomerCountry] = useState('');
    const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);

    const handleSubmitNewCustomer = async () => {

        const customerData = {
            name: newCustomerName,
            mailAdress: newCustomerEmail,
            phoneNr: newCustomerPhone,
            address: {
                street: newCustomerStreet,
                zip: newCustomerZip,
                city: newCustomerCity,
                country: newCustomerCountry,
            },
        };

        try {
            await axios.post('http://localhost:3000/customer/create', customerData);
            fetchCustomers();
            setNewCustomerName('');
            setNewCustomerEmail('');
            setNewCustomerPhone('');
            setNewCustomerStreet('');
            setNewCustomerZip('');
            setNewCustomerCity('');
            setNewCustomerCountry('');
            setIsNewCustomerModalOpen(false);
        } catch (error) {
            console.error("Failed to create customer:", error);
        }
    };


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
        <Sheet
            className={"mx-auto mt-6"}
            sx={{
                maxWidth: 800,
                borderRadius: "md",
                p: 3,
                boxShadow: "lg",
            }}

        >

        <div className="mx-auto">
            <div className=" mx-auto justify-center space-y-4">
                <div className={"mb-4"}>
                    <h1 className={"text-xl text-[#50A6A1]"}>Customers</h1>
                </div>
                <Button variant={"outlined"} onClick={() => setIsNewCustomerModalOpen(true)}>Add New Customer</Button>

                <div className="">
                    <div
                        className={"grid grid-cols-2 gap-4"}
                    >
                        {customers.map((customer: Icustomer) => (
                            <div>
                                <Card
                                    key={customer._id}
                                    variant="outlined"
                                      >
                                    <CardContent>
                                        <Typography
                                            onClick={() => handleCustomerClick(customer)}
                                            level="title-md"
                                        className={"select-none cursor-pointer hover:underline underline-offset-2"}
                                        >{customer.name}</Typography>
                                        <Typography>{customer.address.city}, {customer.address.country}</Typography>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
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
                                    <th style={{width: '20%'}}>Customer</th>
                                    <th style={{width: '80%'}}>{selectedCustomer?.name}</th>
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
                    <Modal
                        aria-labelledby="new-customer-modal-title"
                        aria-describedby="new-customer-modal-description"
                        open={isNewCustomerModalOpen}
                        onClose={() => setIsNewCustomerModalOpen(false)}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Sheet
                            variant="outlined"
                            sx={{
                                width: 'auto',
                                maxWidth: '500px',
                                borderRadius: 'md',
                                p: 3,
                                boxShadow: 'lg',
                            }}
                        >
                            <h2 id="new-customer-modal-title">Add New Customer</h2>
                            <form onSubmit={handleSubmitNewCustomer}>
                                <Input placeholder="Name" value={newCustomerName}
                                       onChange={e => setNewCustomerName(e.target.value)}/>
                                <Input placeholder="Email Address" value={newCustomerEmail}
                                       onChange={e => setNewCustomerEmail(e.target.value)}/>
                                <Input placeholder="Phone Number" value={newCustomerPhone}
                                       onChange={e => setNewCustomerPhone(e.target.value)}/>
                                <Input placeholder="Street" value={newCustomerStreet}
                                       onChange={e => setNewCustomerStreet(e.target.value)}/>
                                <Input type="number" placeholder="Zip Code" value={newCustomerZip}
                                       onChange={e => setNewCustomerZip(e.target.value)}/>
                                <Input placeholder="City" value={newCustomerCity}
                                       onChange={e => setNewCustomerCity(e.target.value)}/>
                                <Input placeholder="Country" value={newCustomerCountry}
                                       onChange={e => setNewCustomerCountry(e.target.value)}/>
                                <Button type="submit">Submit</Button>
                            </form>
                        </Sheet>
                    </Modal>

                </div>
            </div>
        </div>
        </Sheet>
    )
}