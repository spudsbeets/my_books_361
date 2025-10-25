import { Link } from "react-router-dom"
import type PopupProps from "../interfaces/PopupProps";

export function DeletePopup({ isOpen, onClose }: PopupProps) {
    if (!isOpen) return null;

    return(
        <div className="popup-overlay" onClick={onClose}>
            <div id="delete-popup-div" onClick={(e) => e.stopPropagation()}>
                <p id="delete-popup-message">Are you sure you want to delete this book? This action cannot be reversed.</p>
                <div id="delete-popup-options-div">
                    <button className="button-class" onClick={onClose}>Cancel</button>
                    <Link to="/home" id="delete-confirm-link"><button className="button-class">Confirm</button></Link>
                </div>
            </div>
        </div>
    )
}