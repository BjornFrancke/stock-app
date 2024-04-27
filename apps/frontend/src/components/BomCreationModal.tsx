import {Iitems} from "../types.ts";
import Modal from "react-modal";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";

export function BomCreationModal(props: {
    open: boolean,
    onRequestClose: () => void,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    value1: string,
    onChange1: (e: string) => void,
    onClick: () => Promise<void>,
    availableComponents: Iitems[],
}) {
    return <Modal
        isOpen={props.open}
        onRequestClose={props.onRequestClose}
        contentLabel="Create BOM"
        className={"bg-gray-200 w-fit p-12 mx-auto h-fit rounded-2xl mt-36 space-y-6"}
    >
        <h2>Create new BOM</h2>
        <form className={"space-y-2"}>
            <FormLabel>Name</FormLabel>
            <Input
                type="text"
                placeholder="Bom name"
                size="md"
                variant="outlined"
                value={props.value}
                onChange={props.onChange}
            />
            <FormLabel>Product</FormLabel>

            <select
                value={props.value1}
                onChange={(e) => props.onChange1(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full"
            >
                <option value="">Select a Product</option>
                {props.availableComponents.map((component: Iitems) => (
                    <option key={component._id} value={component._id}>
                        {component.name}
                    </option>
                ))}
            </select>
        </form>
        <Button onClick={props.onClick}>Create</Button>
    </Modal>;
}
