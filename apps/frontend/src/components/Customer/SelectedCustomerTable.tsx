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
    const {_id, mailAdress, phoneNr, address} = props.selectedCustomer;
    return <>
        <Table>
            <thead>

            </thead>
            <tbody>
            <tr>
                <td>Mail</td>
                <td>{mailAdress}</td>
            </tr>
            <tr>
                <td>Phone nr.</td>
                <td>{phoneNr}</td>
            </tr>
            <tr>
                <td>ID</td>
                <td>{_id}</td>
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
                <td>{address.street}</td>
            </tr>
            <tr>
                <td>Zip</td>
                <td>{address.zip}</td>
            </tr>
            <tr>
                <td>City</td>
                <td>{address.city}</td>
            </tr>
            <tr>
                <td>Country</td>
                <td>{address.country}</td>
            </tr>
            </tbody>
        </Table>
    </>;
}
