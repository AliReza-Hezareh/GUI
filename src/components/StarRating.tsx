import { Star } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  id?: string;
}

export function StarRatingInput({ value, onChange, id }: StarRatingInputProps) {
  const { releaseMode } = useApp();

  // RELEASE DEFECT: In release mode, stars are span elements with only onClick — no keyboard access
  if (releaseMode) {
    return (
      <div className="flex items-center gap-1" id={id}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => onChange(star)}
            className="cursor-pointer p-0.5"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= value
                  ? "fill-accent text-accent"
                  : "text-muted-foreground/30"
              }`}
              aria-hidden="true"
            />
          </span>
        ))}
        <span className="sr-only">
          {value > 0 ? `${value} out of 5 stars selected` : "No rating selected"}
        </span>
      </div>
    );
  }

  return (
    <fieldset className="flex items-center gap-1" id={id}>
      <legend className="sr-only">Rating</legend>
      {[1, 2, 3, 4, 5].map((star) => (
        <label key={star} className="cursor-pointer p-0.5 focus-within:ring-2 focus-within:ring-ring rounded-sm">
          <input
            type="radio"
            name="star-rating"
            value={star}
            checked={value === star}
            onChange={() => onChange(star)}
            className="sr-only"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          />
          <Star
            className={`h-6 w-6 transition-colors ${
              star <= value
                ? "fill-accent text-accent"
                : "text-muted-foreground/30 hover:text-muted-foreground/60"
            }`}
            aria-hidden="true"
          />
        </label>
      ))}
    </fieldset>
  );
}

interface StarRatingDisplayProps {
  rating: number;
  size?: "sm" | "md";
}

export function StarRatingDisplay({ rating, size = "sm" }: StarRatingDisplayProps) {
  const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= Math.round(rating)
              ? "fill-accent text-accent"
              : "text-muted-foreground/30"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
