import {Iaddress} from "../../types.ts";
import {Table} from "@mui/joy";

export function SelectedCustomerTable(props: {
    selectedCustomer: {
        _id: string | undefined;
        name: string | undefined;
        mailAdress: string | undefined;
        phoneNr?: string | undefined;
        address: Iaddress
    }
}) {
    return <>
        <Table>
            <thead>

            </thead>
            <tbody>
            <tr>
                <td>Mail</td>
                <td>{props.selectedCustomer?.mailAdress}</td>
            </tr>
            <tr>
                <td>Phone nr.</td>
                <td>{props.selectedCustomer?.phoneNr}</td>
            </tr>
            <tr>
                <td>ID</td>
                <td>{props.selectedCustomer?._id}</td>
            </tr>

            </tbody>
        </Table>
        <h1>Address</h1>
        <Table>
            <thead>
            </thead>
            <tbody>
            <tr>
                <td>Street</td>
                <td>{props.selectedCustomer?.address.street}</td>
            </tr>
            <tr>
                <td>Zip</td>
                <td>{props.selectedCustomer?.address.zip}</td>
            </tr>
            <tr>
                <td>City</td>
                <td>{props.selectedCustomer?.address.city}</td>
            </tr>
            <tr>
                <td>Country</td>
                <td>{props.selectedCustomer?.address.country}</td>
            </tr>
            </tbody>
        </Table>
    </>;
}