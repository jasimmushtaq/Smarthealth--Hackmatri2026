import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number; // The current average rating or user's rating
  totalRatings?: number; // Optional, to display total ratings count
  onRate?: (rating: number) => void; // If provided, the component becomes interactive
  readonly?: boolean; // Force readonly mode even if onRate is provided
  size?: "sm" | "md" | "lg";
}

export function StarRating({
  rating,
  totalRatings,
  onRate,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const isInteractive = !!onRate && !readonly;

  const starSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleMouseEnter = (index: number) => {
    if (isInteractive) setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (isInteractive) setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (isInteractive && onRate) onRate(index);
  };

  const displayRating = hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((index) => {
          // If the rating has a decimal, we determine if this star should be partially filled.
          // For simplicity in UI, we just do full stars based on rounding, or a simple check.
          // Since patients can only rate 1-5 integers, fractional values only happen for average display.
          const isFilled = index <= displayRating;
          // Fractional logic (simplified: if rating is 4.5, 5th star is half. For this simple component we will just do full stars or empty, or rounded)
          const isHalf = !isFilled && index - 0.5 <= displayRating;

          return (
            <Star
              key={index}
              className={cn(
                starSizes[size],
                isInteractive ? "cursor-pointer transition-transform hover:scale-110" : "",
                (isFilled || isHalf) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              )}
              onMouseEnter={() => handleMouseEnter(index)}
              onClick={() => handleClick(index)}
              style={isHalf ? { clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" } : {}}
            />
          );
        })}
      </div>
      {totalRatings !== undefined && (
        <span className="text-sm text-muted-foreground">
          ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
        </span>
      )}
    </div>
  );
}
