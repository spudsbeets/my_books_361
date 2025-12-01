import { NavBar } from "../components/NavBar"
import { UpdateProfilePopup } from "../components/UpdateProfilePopup"
import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

export function ProfilePage() {

    const [isProfilePopup, setProfilePopup] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("");
    const [holiday, setHoliday] = useState<string>("");

    // Set up date data for holiday microservice
    const now: Date = new Date();
    const year: number = now.getFullYear();
    const month: string = String(now.getMonth() + 1).padStart(2, "0");
    let day: string = String(now.getDate()).padStart(2, "0");

    const fetchEmail = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found.")
                return;
            }

            const decoded: any = jwtDecode(token);
            const userID = decoded.id;

            const response = await fetch(`http://localhost:5400/api/user/${userID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error("Failed to fetch user data");
                return;
            }

            const data = await response.json();
            setEmail(data.email);
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    const fetchHolidays = async() => {
        const res = await fetch(`http://localhost:3100/holidays?date=${year}-${month}-${day}`, {
            method: "GET"
        });

        const data = await res.json();
        
        if (data.holidays.length === 0) {
            setHoliday("No holidays today!")
        } else {
            setHoliday("Happy " + data.holidays[0].name + "!")
        }
    }

    // Fetch email and holiday data on render
    useEffect(() => {
        fetchEmail();
        fetchHolidays();
    },[])

    const handleProfileUpdate = () => {
        fetchEmail();
        setProfilePopup(false);
    };

    return(
        <>
        <NavBar />
        <div id="profile-div">
            <div id="profile-div-left">
                <h2 id="profile-greeting">Hey, glad you're here!</h2>
                <h3 id="holiday-message">{holiday}</h3>
                <div id="profile-info-div">
                    <p className="profile-info">Email: {email}</p>
                </div>
                <button className="button-class" onClick={() => setProfilePopup(true)}>Update Profile</button>
            </div>
            <div id="profile-div-right">
                <p id="profile-about">Check on and update your personal information here!</p>
            </div>
        </div>

        <UpdateProfilePopup isOpen={isProfilePopup} onClose={handleProfileUpdate} />
        </>
    )
}