import type PopupProps from "../interfaces/PopupProps";

export function EditSuccessPopup({ isOpen, onClose }: PopupProps) {
    if (!isOpen) return null;

    return(
        <div className="popup-overlay" onClick={onClose}>
            <div id="edit-success-popup" onClick={(e) => e.stopPropagation()}>
                <p>Book edited successfully!</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    )
}