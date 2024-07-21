import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import {Icustomer} from "../../types.ts";

export const OrderCreationModal = (props: {
    open: boolean
    onClose: () => void;
    recipient: string;
    onRecipientChange: (e: string) => void;
    availableCustomers: Icustomer[];
    onSubmit: () => Promise<void>,
    onChangeDate: (e: Date | null) => void,



}) => {


    return (

        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={props.open}
            onClose={props.onClose}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
            className={"focus:outline-none"}
        >
            <Sheet
                variant="outlined"
                sx={{
                    maxWidth: 800,
                    minWidth: 800,
                    minHeight: 400,
                    borderRadius: "md",
                    p: 6,
                    boxShadow: "lg",
                }}
            >
                <div className={"w-48 space-y-8"}>
                    <h1 className={"text-[#50A6A1] text-xl"}>New order</h1>
                    <form className={"mb-4 flex flex-col justify-between w-fit"}>
                        <div className={"flex space-x-2"}>
                            <div className={"flex mb-4 space-x-2"}>
                                <h2 className={"my-auto"}>Customer:</h2>
                                <select
                                    value={props.recipient}
                                    onChange={(e) => props.onRecipientChange(e.target.value)}
                                    className="border border-gray-300 rounded-md p-2"
                                >
                                    <option value="">Select a Customer</option>
                                    {props.availableCustomers.map((customer: Icustomer) => (
                                        <option key={customer.name} value={customer.name}>
                                            {customer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className={"flex space-x-2 min-w-full mb-4"}>
                            <h2 className={"my-auto text-nowrap"}>Due date:</h2>
                            <div className={"w-48"}>
                                <Input
                                    type="date"
                                    placeholder="Date"
                                    onChange={(e) => props.onChangeDate(e.target.valueAsDate)}
                                    className="px-2 border border-gray-300  w-48"
                                />
                            </div>
                        </div>
                        <div className={"space-x-2"}>
                            <Button onClick={props.onSubmit}>Submit</Button>
                            <Button
                                onClick={props.onClose}
                                color="danger"
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </Sheet>
        </Modal>
    )
}
