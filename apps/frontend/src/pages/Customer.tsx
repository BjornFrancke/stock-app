import {Button, CardContent, Input, Modal, Sheet, Typography} from "@mui/joy";
import {Icustomer} from "../types";
import {useEffect, useState} from "react";
import Card from "@mui/joy/Card";
import {SelectedCustomerTable} from "../components/Customer/SelectedCustomerTable.tsx";
import {instance} from "../services/backend-api/axiosConfig.ts";


export function Customer() {
    const [customers, setCustomers] = useState([])
    const [selectedCustomer, setSelectedCustomer] = useState<Icustomer | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newCustomer, setNewCustomer] = useState({
        name: "",
        email: "",
        phone: "",
        street: "",
        zip: 0,
        city: "",
        country: "",
    })
    const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);


    const handleNewCustomerDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCustomer({
            ...newCustomer,
            [e.target.name]: e.target.value
        })
    }


    const handleSubmitNewCustomer = async () => {

        const customerData = {
            name: newCustomer.name,
            mailAdress: newCustomer.email,
            phoneNr: newCustomer.phone,
            address: {
                street: newCustomer.street,
                zip: newCustomer.zip,
                city: newCustomer.city,
                country: newCustomer.country,
            },
        };

        try {
            await instance.post('/customer', customerData);
            fetchCustomers();
            setNewCustomer(newCustomer) // Sets state to initial state
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
            await instance.delete(`/customer/${customerId}`)
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
        const response = await instance.get('/customer');
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
                                <div key={customer._id}>
                                    <Card
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
                                className="space-y-4 focus:outline-none"
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
                                className="focus:outline-none space-y-4"
                                sx={{
                                    minWidth: "300px",
                                    width: 'auto',
                                    maxWidth: '500px',
                                    borderRadius: 'md',
                                    p: 3,
                                    boxShadow: 'lg',
                                }}
                            >
                                <h2 id="new-customer-modal-title">Add New Customer</h2>
                                <form onSubmit={handleSubmitNewCustomer} className={"space-y-4"}>
                                    <Input placeholder="Name" name={"name"} value={newCustomer.name}
                                           onChange={(e) => handleNewCustomerDataChange(e)}/>
                                    <Input placeholder="Email Address" name={"email"} value={newCustomer.email}
                                           onChange={e => handleNewCustomerDataChange(e)}/>
                                    <Input placeholder="Phone Number" name={"phone"} value={newCustomer.phone}
                                           onChange={e => handleNewCustomerDataChange(e)}/>
                                    <Input placeholder="Street" name={"street"} value={newCustomer.street}
                                           onChange={e => handleNewCustomerDataChange(e)}/>
                                    <Input type="number" name={"zip"} placeholder="Zip Code" value={newCustomer.zip}
                                           onChange={e => handleNewCustomerDataChange(e)}/>
                                    <Input placeholder="City" name={"city"} value={newCustomer.city}
                                           onChange={e => handleNewCustomerDataChange(e)}/>
                                    <Input placeholder="Country" name={"country"} value={newCustomer.country}
                                           onChange={e => handleNewCustomerDataChange(e)}/>
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
