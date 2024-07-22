import {Iorder} from "../../types.ts";
import Table from "@mui/joy/Table";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import {CheckBadgeIcon} from "@heroicons/react/16/solid";
import ChipDelete from "@mui/joy/ChipDelete";

export const OrdersTable = (props: {
    orders: Iorder[];
    onAddOrderClick: () => void,
    onClickOrder: (e: Iorder) => void,
    onMarkAsDone: (e: Iorder | null) => void,
    onDelete: (e: string | undefined) => Promise<void>,

}) => {
    return (
    <Table borderAxis="both" className={""}>
        <thead>
        <tr>
            <th>#</th>
            <th>Customer</th>
            <th>Due date</th>
            <th>Status</th>
            <th>
                <Button variant={"outlined"}
                        onClick={props.onAddOrderClick}>
                    Add Order
                </Button>
            </th>
        </tr>
        </thead>
        <tbody>
        {props.orders.map((order: Iorder) => (
            <tr key={order._id}>
                <td className=" underline cursor-pointer select-none"
                    onClick={() => props.onClickOrder(order)}>
                    {order.orderNumber}
                </td>
                <td>{order.receptian}</td>
                <td>{new Date(order.dueDate).toLocaleDateString()}</td>
                <td>
                    {order.isDone ? <Chip color="success">Done!</Chip> : <Chip
                        onClick={() => props.onMarkAsDone(order || null)}
                        endDecorator={
                            <CheckBadgeIcon className="h-3 w-3 text-black"/>
                        }
                    >
                        Not done!
                    </Chip>
                    }
                </td>
                <td>
                    {" "}
                    <Chip
                        variant="soft"
                        color="danger"
                        size="sm"
                        className={"select-none"}
                        endDecorator={
                            <ChipDelete onClick={() => props.onDelete(order._id)}/>
                        }
                    >
                        Delete
                    </Chip>
                </td>
            </tr>
        ))}
        </tbody>
    </Table>
    )
}
