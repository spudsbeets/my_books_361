import { useState } from "react";

interface StarRatingProps {
  rating: number,
  onChange: (value: number) => void;
}

export function StarRating({ rating, onChange }: StarRatingProps) {

  return (
    <div style={{ display: "flex", gap: "0.5rem", backgroundColor: "#223" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          style={{
            fontSize: "2rem",
            color: star <= rating ? "#ffc107" : "#e4e5e9",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}