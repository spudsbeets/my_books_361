import type PopupProps from "../interfaces/PopupProps";

interface DeletePopupProps extends PopupProps {
    onConfirm: () => void
}

export function DeletePopup({ isOpen, onClose, onConfirm }: DeletePopupProps) {
    if (!isOpen) return null;

    return(
        <div className="popup-overlay" onClick={onClose}>
            <div id="delete-popup-div" onClick={(e) => e.stopPropagation()}>
                <p id="delete-popup-message">Are you sure you want to delete this book? This action cannot be reversed.</p>
                <div id="delete-popup-options-div">
                    <button className="button-class" onClick={onClose}>Cancel</button>
                    <button className="button-class" onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    )
}