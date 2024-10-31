import Card from "@mui/joy/Card";
import {CardContent, Typography} from "@mui/joy";
import {useEffect, useState} from "react";
import {instance} from "../services/backend-api/axiosConfig.ts";

export const ConnectionStatusCard = () => {
    const [connectionStatus, setConnectionStatus] =
        useState<string>("Checking...");

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const response = await instance.get("/status");
                if (response.status === 200) {
                    setConnectionStatus("Connected");
                } else {
                    setConnectionStatus("Disconnected");
                }
            } catch (error) {
                setConnectionStatus("Disconnected");
            }
        };

        checkConnection();

        const interval = setInterval(checkConnection, 5000); // Check connection every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Connected":
                return "green";
            case "Disconnected":
                return "red";
            default:
                return "orange";
        }
    };

    return (
        <Card style={{ maxWidth: 300, margin: "1rem auto" }}>
            <CardContent>
                <Typography level="body-lg" component="div">
                    Backend Connection Status
                </Typography>
                <Typography
                    level="body-md"
                    color="neutral"
                    style={{ color: getStatusColor(connectionStatus) }}
                >
                    {connectionStatus}
                </Typography>
            </CardContent>
        </Card>
    );
};
