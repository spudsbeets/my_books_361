import { StarRating } from "./StarRating"
import type PopupProps from "../interfaces/PopupProps";

export function UpdateReviewPopup({ isOpen, onClose }: PopupProps) {
    if (!isOpen) return null;

    return(
        <div className="popup-overlay" onClick={onClose}>
            <div id="update-review-popup-div" onClick={(e) => e.stopPropagation()}>
                <StarRating />
                <input type="text" placeholder="Update your review here" id="update-review-input"></input>
                <button className="button-class" onClick={onClose}>Update Review</button>
            </div>
        </div>
    )
}