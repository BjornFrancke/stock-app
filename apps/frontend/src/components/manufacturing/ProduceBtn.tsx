import Button from "@mui/joy/Button";



interface Props {
    produceState: "ready" | "producing" | "completed",
    onClick: () => Promise<void>,
};

export const ProduceBtn: React.FC<Props> = ({produceState, onClick}) => {
    if (produceState === "ready") {
        return (
            <Button onClick={onClick} size={"sm"}>Produce</Button>
        )
    }
    if (produceState === "producing") {
        return (
            <Button loading size={"sm"}>Produce</Button>
        )
    }
    else {
        return (
            <Button variant={"soft"} color={"success"}
                    size={"sm"}>Completed</Button>
        )
    }
}