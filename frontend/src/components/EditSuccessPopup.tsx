import { useNavigate } from "react-router-dom";

interface EditSuccessProps {
    isOpen: boolean,
    bookID?: string
}

export function EditSuccessPopup({ isOpen, bookID }: EditSuccessProps) {
    if (!isOpen) return null;

    const navigate = useNavigate();

    return(
        <div className="popup-overlay" onClick={() => navigate(`/bookInfo/${bookID}`)}>
            <div id="edit-success-popup" onClick={(e) => e.stopPropagation()}>
                <p>Book edited successfully!</p>
                <button onClick={() => navigate(`/bookInfo/${bookID}`)}>Close</button>
            </div>
        </div>
    )
}