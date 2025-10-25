import type PopupProps from "../interfaces/PopupProps";

export function UpdateProfilePopup({ isOpen, onClose }: PopupProps) {
    if (!isOpen) return null;

    return(
        <div className="popup-overlay" onClick={onClose}>
            <div id="update-profile-popup-div" onClick={(e) => e.stopPropagation()}>
                <form id="update-profile-popup-form">
                    <label htmlFor="first-name">First Name: </label>
                    <input id="first-name" type="text" placeholder="Sean"></input>
                    <label htmlFor="last-name">Last Name: </label>
                    <input id="last-name" type="text" placeholder="Miller"></input>
                    <label htmlFor="birthdate">Birthdate: </label>
                    <input id="birthdate" type="date"></input>
                    <label htmlFor="email">Email: </label>
                    <input id="email" type="email" placeholder="millersean757@gmail.com"></input>
                    <button className="button-class" onClick={onClose}>Update Profile</button>
                </form>
            </div>
        </div>
    )
}