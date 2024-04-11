import {Button, CardContent, Input, Modal, Sheet, Typography} from "@mui/joy";
import {Icustomer} from "../types";
import {useEffect, useState} from "react";
import axios from "axios";
import Card from "@mui/joy/Card";
import {SelectedCustomerTable} from "../components/Customer/SelectedCustomerTable.tsx";

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


    const handleCustomerDelete = async (customerId: string | undefined) => {
        try {
            if (customerId === undefined) {
                console.error("Customer ID is undefined")
                return
            }
            await axios.delete(`http://localhost:3000/customer/delete/${customerId}`)
            fetchCustomers()
            setIsModalOpen(false)
        } catch {
            console.error("Internal server error")
        }
    }

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
                    <Button variant={"outlined"} onClick={() => setIsNewCustomerModalOpen(true)}>Add New
                        Customer</Button>

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
                                className="space-y-4"
                                sx={{
                                    maxWidth: 800,
                                    minWidth: 800,
                                    minHeight: 400,
                                    borderRadius: "md",
                                    p: 6,
                                    boxShadow: "lg",

                                }}
                            >
                                <div className={"flex justify-between"}>
                                    <div className={"flex space-x-2 mb-12"}>

                                        <h1 className={"text-[#50A6A1] text-2xl"}>Customer</h1>
                                        <h1 className={"text-2xl text-gray-500"}>{selectedCustomer?.name}</h1>

                                    </div>
                                    <div>
                                        <Button variant={"soft"} color={"danger"} size={"sm"} className={"my-auto"}
                                                onClick={() => handleCustomerDelete(selectedCustomer?._id)}
                                        >Delete</Button>
                                    </div>
                                </div>

                                <h1>Contact</h1>
                                {selectedCustomer && (
                                    <SelectedCustomerTable selectedCustomer={selectedCustomer}/>
                                )}
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