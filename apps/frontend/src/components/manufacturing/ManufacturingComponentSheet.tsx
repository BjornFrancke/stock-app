import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import {ImanufacturingOrder} from "../../pages/Manufacturing.tsx";

export const ManufacturingComponentSheet = (props: {
    selectedOrder: ImanufacturingOrder
}) => {
    return (
        <Sheet
            variant="outlined"
            sx={{
                maxWidth: 800,
                minWidth: 800,
                borderRadius: "md",
                p: 6,
                boxShadow: "lg",
            }}>
            <Table borderAxis={"both"}>
                <thead>
                <tr>
                    <th>Component Name</th>
                    <th>Required Quantity</th>
                    <th>Consumed</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {props.selectedOrder?.componentStatus?.map((component, index) => (
                    <tr key={index}>
                        <td>{component.name || "Unnamed"}</td>
                        <td>{component.required * (props.selectedOrder?.quantity?.toProduce || 0)}</td>
                        <td>{component.required * (props.selectedOrder?.quantity?.produced || 0)}</td>
                        <td>{component.status ? "Available" : "Not Sufficient"}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Sheet>
    )
}
