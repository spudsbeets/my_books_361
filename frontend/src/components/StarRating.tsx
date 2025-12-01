import type StarRatingProps from "../interfaces/StarRatingProps";

export function StarRating({ rating, onChange }: StarRatingProps) {

  return (
    <div id="star-div">
      {[1, 2, 3, 4, 5].map((star) => (
        <button className={`star-button ${star <= rating ? "active" : ""}`} key={star} onClick={() => onChange(star)}>
          ★
        </button>
      ))}
    </div>
  );
}