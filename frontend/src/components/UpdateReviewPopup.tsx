import { useState } from "react"
import { StarRating } from "./StarRating"
import type PopupProps from "../interfaces/PopupProps";

interface UpdateReviewPopupProps extends PopupProps {
    bookID: number,
    currentReview?: { rating: number, reviewText: string } | null,
    onReviewUpdate: () => void
}

export function UpdateReviewPopup({ isOpen, onClose, bookID, currentReview, onReviewUpdate }: UpdateReviewPopupProps) {
    const [rating, setRating] = useState(currentReview?.rating || 0)
    const [reviewText, setReviewText] = useState(currentReview?.reviewText || "")
    
    if (!isOpen) return null;

    const handleUpdate = async () => {
        const token = localStorage.getItem("token");

        await fetch(`http://localhost:4020/api/books/userReviews/${bookID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ rating, reviewText }),            
        });

        onReviewUpdate();
        onClose();
    }

    return(
        <div className="popup-overlay" onClick={onClose}>
            <div id="update-review-popup-div" onClick={(e) => e.stopPropagation()}>
                <StarRating rating={rating} onChange={setRating} />
                <textarea id="update-review-input" placeholder="Update your review here." value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
                <button className="button-class" onClick={handleUpdate}>{currentReview ? "Update Review" : "Add Review"}</button>
            </div>
        </div>
    )
}