interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (stars: number) => void;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  interactive = false,
  onRate,
}: StarRatingProps) {
  const sizeClass =
    size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";

  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`}>
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i + 1 <= Math.round(rating);
        const starIndex = i;
        return (
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: star indices are stable
            key={starIndex}
            type="button"
            onClick={() => interactive && onRate?.(i + 1)}
            disabled={!interactive}
            className={`transition-transform ${interactive ? "hover:scale-125 cursor-pointer" : "cursor-default"}`}
            style={{
              color: filled ? "oklch(var(--gold))" : "oklch(var(--border))",
            }}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
