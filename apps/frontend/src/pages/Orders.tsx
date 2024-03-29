import Table from "@mui/joy/Table";

export function Orders() {
    return (
        <>
        <h1 className="text-center mt-6">Orders</h1>
        <div className="flex w-screen justify-center mt-12">
        <Table 
        borderAxis="both"
        className={"max-w-[50%]"}>
            <thead>
                <tr>
                    <td>#</td>
                    <td>Status</td>
                    <td>Due date</td>
                </tr>
            </thead>
            <tr>
            <td>1</td>
            <td>Ready</td>
            <td>12/09-2024</td>

            </tr>
        </Table>
        </div>
        </>
    )
}