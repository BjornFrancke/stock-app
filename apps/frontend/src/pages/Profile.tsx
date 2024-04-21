import {useEffect, useState} from "react";
import {instance} from "../services/backend-api/axiosConfig.ts";
import Sheet from "@mui/joy/Sheet";

export function Profile() {
    const [profileInfo, setProfileInfo] = useState({
        name: "",
        email: ""
    })

    const fetchProfile = async () => {
        const profileData = await instance.get('/user/me')
        setProfileInfo({
            name: profileData.data.name || "username",
            email: profileData.data.email || "Email Address",
        })

    }

    useEffect(() => {
        fetchProfile()
    }, []);



    return (
        <>
            <Sheet
                className={"mx-auto mt-6 space-y-4"}
                sx={{
                    maxWidth: 800,
                    borderRadius: "md",
                    p: 3,
                    boxShadow: "lg",
                }}>
                <h1 className="text-xl mb-12">Profile</h1>
                <div className={"flex space-x-1"}>
                    <p>Name</p>
                    <p>{profileInfo.name}</p>
                </div>
                <div className={"flex space-x-1"}>
                    <p>Email</p>
                    <p>{profileInfo.email}</p>
                </div>

            </Sheet>
        </>
    )
}