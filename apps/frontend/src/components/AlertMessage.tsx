import {Snackbar} from "@mui/joy";

export interface Ialert {
    open: boolean,
    text: string,
    severity?: "success" | "warning" | "danger"
}

export function AlertMessage(props: { alertContent: Ialert, onClose: () => void }) {
    return <Snackbar open={props.alertContent.open} color={props.alertContent.severity} variant={"solid"}
                     autoHideDuration={2000}
                     onClose={props.onClose}>{props.alertContent.text}</Snackbar>;
}