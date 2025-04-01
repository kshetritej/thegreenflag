import { Label } from "../ui/label"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function Rating({ value, onChange }: { value: number, onChange: (value: number) => void }) {
  const [rating, setRating] = useState<number>(value || 0)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)

  const ratingText = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent"
  }

  return (
    <>
      <p className="font-medium text-2xl">How would you rate your experience?</p>
      <div className="flex items-center gap-4">
        <div className="flex flex-row gap-2 pt-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Label
              key={index}
              htmlFor={`rating-${index + 1}`}
              className="cursor-pointer relative group"
              onMouseEnter={() => setHoveredRating(index + 1)}
              onMouseLeave={() => setHoveredRating(null)}
            >
              <input
                id={`rating-${index + 1}`}
                type="radio"
                name="rating"
                value={index + 1}
                className="hidden"
                checked={rating === index + 1}
                onChange={() => {
                  setRating(index + 1)
                  onChange(index + 1)
                }}
                onMouseEnter={() => setHoveredRating(index + 1)}
                onMouseLeave={() => setHoveredRating(null)}
              />
              <div
                className={cn(
                  "size-10 border-4 border-emerald-500 rounded-full transition-colors hover:bg-emerald-500",
                  index < rating ? "bg-emerald-500" : "bg-none"
                )}
              />
            </Label>
          ))}
        </div>
        {hoveredRating && (
          <span className="text-sm text-gray-600">
            {ratingText[hoveredRating as keyof typeof ratingText]}
          </span>
        )}
        {rating > 0 && !hoveredRating && (
          <span className="text-sm text-gray-600">
            {ratingText[rating as keyof typeof ratingText]}
          </span>
        )}
      </div>
    </>
  )
}
