import type PopupProps from "../interfaces/PopupProps";
import { useState } from "react"

export function UpdateProfilePopup({ isOpen, onClose }: PopupProps) {
    const [email, setEmail] = useState("");

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5400/api/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ email })
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Profile update failed:", errorData.message);
                return;
            }

            onClose();

        } catch(err) {
            console.error("Profile update failed.")
        }
    };

    return(
        <div className="popup-overlay" onClick={onClose}>
            <div id="update-profile-popup-div" onClick={(e) => e.stopPropagation()}>
                <form id="update-profile-popup-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email: </label>
                    <input id="email" type="email" name="email" value={email} onChange={handleChange}></input>
                    <button className="button-class" type="submit">Update Profile</button>
                </form>
            </div>
        </div>
    )
}