import type PopupProps from "../interfaces/PopupProps";
import { useState } from "react"

export function UpdateProfilePopup({ isOpen, onClose }: PopupProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        birthdate: "",
        email: ""
    })

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:4020/api/books/users/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
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
                    <label htmlFor="first-name">First Name: </label>
                    <input id="first-name" type="text" name="firstName" value={formData.firstName} onChange={handleChange}></input>
                    <label htmlFor="last-name">Last Name: </label>
                    <input id="last-name" type="text" name="lastName" value={formData.lastName} onChange={handleChange}></input>
                    <label htmlFor="birthdate">Birthdate: </label>
                    <input id="birthdate" type="date" name="birthdate" value={formData.birthdate} onChange={handleChange}></input>
                    <label htmlFor="email">Email: </label>
                    <input id="email" type="email" name="email" value={formData.email} onChange={handleChange}></input>
                    <button className="button-class" type="submit">Update Profile</button>
                </form>
            </div>
        </div>
    )
}