import { NavBar } from "../components/NavBar"
import { UpdateProfilePopup } from "../components/UpdateProfilePopup"
import { useState, useEffect } from "react"

export function ProfilePage() {
    const [isProfilePopup, setProfilePopup] = useState<boolean>(false)
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        birthdate: "",
        email: ""
    });

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:4020/api/books/users", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

            if (!response.ok) {
                console.error("Failed to fetch user data");
                return;
            }

            const data = await response.json();
            setUserData(data);
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    useEffect(() => {
        fetchUserData();
    },[])

    const handleProfileUpdate = () => {
        fetchUserData();
        setProfilePopup(false);
    };

    return(
        <>
        <NavBar />
        <div id="profile-div">
            <div id="profile-div-left">
                <h2 id="profile-greeting">Hey {userData.firstName}, glad you're here!</h2>
                <div id="profile-info-div">
                    <p className="profile-info">First Name: {userData.firstName}</p>
                    <p className="profile-info">Last Name: {userData.lastName}</p>
                    <p className="profile-info">Birthdate: {new Date(userData.birthdate).toLocaleDateString("en-US")}</p>
                    <p className="profile-info">Email: {userData.email}</p>
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