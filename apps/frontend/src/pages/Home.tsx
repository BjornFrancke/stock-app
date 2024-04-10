import Sheet from "@mui/joy/Sheet";

export function Home() {
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
                <div>
                    <h1>Welcome user!</h1>
                </div>
                <div className={"grid grid-cols-2 space-x-4 mt-4"}>
                <div className={"border min-w-24 min-h-16"}>
                    Pending Orders
                </div>
                <div className={"border min-w-24 min-h-16"}>
                    Another stat
                </div>
                </div>

            </Sheet>

        </>
    )
}

