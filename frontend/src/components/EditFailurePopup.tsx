import type PopupProps from "../interfaces/PopupProps";

export function EditFailurePopup({ isOpen, onClose }: PopupProps) {
    if (!isOpen) return null;

    return(
        <div className="popup-overlay" onClick={onClose}>
            <div id="edit-failure-popup" onClick={(e) => e.stopPropagation()}>
                <p>Book not edited, server failure.</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    )
}