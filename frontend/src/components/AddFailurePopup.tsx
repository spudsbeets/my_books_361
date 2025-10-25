import type PopupProps from "../interfaces/PopupProps";

export function AddFailurePopup({ isOpen, onClose }: PopupProps) {
    if (!isOpen) return null;

    return(
        <div className="popup-overlay" onClick={onClose}>
            <div id="add-failure-popup" onClick={(e) => e.stopPropagation()}>
                <p>Book not added, please fix required fields.</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    )
}