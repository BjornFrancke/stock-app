import Sheet from "@mui/joy/Sheet";
import {RegisterUser} from "../components/Admin/RegisterUser.tsx";
import {UserList} from "../components/Admin/UserList.tsx";


export function Admin() {
    return (
        <>
            <Sheet
                className={"mx-auto mt-6"}
                sx={{
                        maxWidth: 800,
                        borderRadius: "md",
                        p: 3,
                        boxShadow: "lg", }}
            >
                    <h1>Admin page</h1>
                    <RegisterUser/>
                <UserList/>

            </Sheet>
        </>
    )
}
