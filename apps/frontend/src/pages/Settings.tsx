import Sheet from "@mui/joy/Sheet";
import {Select} from "@mui/joy";
import Button from "@mui/joy/Button";

export function Settings() {
    return (
        <>
            <Sheet
                className={"mx-auto mt-6"}
                sx={{
                    maxWidth: 800,
                    borderRadius: "md",
                    p: 3,
                    boxShadow: "lg",
                }}
            >
                <div className={"space-y-4"}>
                <h1 className={"text-xl mb-12"}>Settings</h1>
                <div className={"flex space-x-2"}>
                    <h2 className={"my-auto"}>Language</h2>
                    <Select
                        className="p-2 w-1/3 border border-gray-300 rounded-md"
                        placeholder={"English"}
                    >
                        <option value="English">English</option>
                        <option value="Spanish">Danish</option>
                        <option value="French">German</option>
                    </Select>

                </div>
                <Button>
                    Save
                </Button>

                </div>
            </Sheet>
        </>
    )
}