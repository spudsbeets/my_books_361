import { NavBar } from "../components/NavBar"
import { UpdateProfilePopup } from "../components/UpdateProfilePopup"
import { useState } from "react"

export function ProfilePage() {
    const [isProfilePopup, setProfilePopup] = useState<boolean>(false)

    return(
        <>
        <NavBar />
        <div id="profile-div">
            <div id="profile-div-left">
                <h2 id="profile-greeting">Hey Sean, glad you're here!</h2>
                <div id="profile-info-div">
                    <p className="profile-info">First Name: Sean</p>
                    <p className="profile-info">Last Name: Miller</p>
                    <p className="profile-info">Birthdate: 04/01/95</p>
                    <p className="profile-info">Email: millersean757@gmail.com</p>
                </div>
                <button className="button-class" onClick={() => setProfilePopup(true)}>Update Profile</button>
            </div>
            <div id="profile-div-right">
                <p id="profile-about">Check on and update your personal information here!</p>
            </div>
        </div>

        <UpdateProfilePopup isOpen={isProfilePopup} onClose={() => setProfilePopup(false)} />
        </>
    )
}