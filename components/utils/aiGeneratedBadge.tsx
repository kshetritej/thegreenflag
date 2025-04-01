import { Info } from "lucide-react";

export function AiGeneratedBadge({ what }: { what?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
      <Info className="h-4 w-4" />
      <span>AI Generated {what}</span>
    </div>
  )
}