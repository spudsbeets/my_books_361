import type PopupProps from "../interfaces/PopupProps";

export function AddSuccessPopup({ isOpen, onClose }: PopupProps) {
    if (!isOpen) return null;

    return(
        <div className="popup-overlay" onClick={onClose}>
            <div id="add-success-popup" onClick={(e) => e.stopPropagation()}>
                <p>Book added successfully!</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    )
}