import Sheet from "@mui/joy/Sheet";
import Card from "@mui/joy/Card";
import {CardActions, CardContent, CircularProgress, SvgIcon, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {instance} from "../services/backend-api/axiosConfig.ts";

export function Dashboard() {
    const [pendingOrder, setPendingOrders] = useState<{
        percentage: number,
        value: number
    }>({
        percentage: 0,
        value: 0
    });

    const [profileInfo, setProfileInfo] = useState({
        name: "",
        email: ""
    })

    const navigate = useNavigate()


    const fetchProfile = async () => {
        const profileData = await instance.get('/user/me')
        setProfileInfo({
            name: profileData.data.name || "username",
            email: profileData.data.email || "Email Address",
        })

    }


    const checkLoginStatus = () => {
        const token = localStorage.getItem("token")
        console.log(token)
        if (!token) {
            console.log("Token not found");
            navigate("/login")
        }
    }

    useEffect(() => {
        checkLoginStatus()
        fetchProfile()

        getPendingOrderPercentage()
    }, []);


    const getPendingOrderPercentage = async () => {
        instance.get('/orders/status').then((response) => {
            setPendingOrders({
                percentage: Number(response.data.Percentage),
                value: Number(response.data.Value)
            })
        }).catch((error) => {
            console.log(error)
        })
    }

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
                    <h1 className={"text-xl"}>Welcome {profileInfo.name}!</h1>
                </div>
                <div className={"grid grid-cols-2 space-x-4 mt-12"}>
                    <Card variant="solid" color={"primary"} invertedColors>
                        <CardContent orientation="horizontal">
                            <CircularProgress size="lg" determinate value={pendingOrder.percentage}>
                                <SvgIcon>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                                        />
                                    </svg>
                                </SvgIcon>
                            </CircularProgress>
                            <CardContent>
                                <Typography level="body-md">Pending sale</Typography>
                                <Typography level="h2">{pendingOrder.value} kr.</Typography>
                            </CardContent>
                        </CardContent>
                        <CardActions>
                            <Button variant="soft" size="sm">
                                Add to Watchlist
                            </Button>
                            <Button variant="solid" size="sm">
                                Go to orders
                            </Button>
                        </CardActions>
                    </Card>
                    <Card variant="soft">
                        <CardContent>
                            <Typography level="title-md">Low stock</Typography>
                            <Typography>Description of the card.</Typography>
                        </CardContent>
                    </Card>

                </div>

            </Sheet>

        </>
    )
}

