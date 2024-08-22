import {Snackbar} from "@mui/joy";

export interface Ialert {
    open: boolean,
    text: string,
    severity?: "success" | "warning" | "danger"
}

export function AlertMessage(props: { alertContent: Ialert, onClose: () => void }) {
    const {onClose, alertContent} = props;
    const {open, text, severity} = alertContent;

    return <Snackbar
        open={open}
        color={severity}
        variant={"solid"}
        autoHideDuration={2000}
        onClose={onClose}>
        {text}
    </Snackbar>;
}
