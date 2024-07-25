import Button from "@mui/joy/Button";
import {instance} from "../../services/backend-api/axiosConfig.ts";
const handleCheckForUserHasOrg = () => {
    instance.post("/organisation/checkIfUserDataHasOrganisation").then(() => {}).catch(error => {
        console.log(error);
    })
}


export const DebugBtn = () => {
    return (
        <>
        <Button variant="solid" onClick={() => handleCheckForUserHasOrg()}>Check if user has org</Button>
        </>
    )
}
