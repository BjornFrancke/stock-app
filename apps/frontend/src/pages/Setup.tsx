import {RegisterUser} from "../components/setup/RegisterUser.tsx";

export function SetupPage() {
    return (
        <div className={"mt-6"}>
            <h1 className={"text-center"}>Setup</h1>
        <RegisterUser/>
        </div>
    )
}
