import Input from "@mui/joy/Input";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import {ImanufacturingOrder} from "../../pages/Manufacturing.tsx";

export const ManufacturingInfoSheet = (props: {
    selectedOrder: ImanufacturingOrder,
    selectedOrderProduced: number,
    setSelectedOrderProduced: (e: number) => void,
    handleNavigateToBom: (e: string) => void,
    handleNavigateToProduct: (e: string) => void,

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
            <div className={"flex space-x-2 mb-4"}>
                <h1 className={"text-[#50A6A1] my-auto"}>Quantity</h1>
                <div className={"max-w-24"}>
                    {props.selectedOrder?.isDone ?
                        <Input variant={"outlined"} disabled type={"number"} size={"sm"}
                               endDecorator={<p>/ {props.selectedOrder?.quantity?.toProduce}</p>}
                               value={props.selectedOrderProduced}
                               onChange={(e) => props.setSelectedOrderProduced(e.target.valueAsNumber)}
                        /> : <Input variant={"outlined"} type={"number"} size={"sm"}
                                    endDecorator={<p>/ {props.selectedOrder?.quantity?.toProduce}</p>}
                                    value={props.selectedOrderProduced}
                                    onChange={(e) => props.setSelectedOrderProduced(e.target.valueAsNumber)}
                        />}

                </div>
                <h1 className={" text-gray-500 my-auto"}>To Produce</h1>
            </div>
            <Table borderAxis={"x"}>
                <tbody>
                <tr>
                    <td>BOM</td>
                    <td onClick={() => props.handleNavigateToBom(props.selectedOrder?.bom.bomId || "")} className={"underline select-none cursor-pointer"}>{props.selectedOrder?.bom.name}</td>
                </tr>
                <tr>
                    <td>Product</td>
                    <td onClick={() => props.handleNavigateToProduct(props.selectedOrder?.product.productId || "")}
                        className={"underline select-none cursor-pointer"}>{props.selectedOrder?.product.name}</td>

                </tr>
                </tbody>
            </Table>

        </Sheet>
    )
}
