import { useState } from "react";

export function StarRating() {
  const [rating, setRating] = useState(0); // 0 = no stars

  return (
    <div style={{ display: "flex", gap: "0.5rem", backgroundColor: "#223" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => setRating(star)}
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