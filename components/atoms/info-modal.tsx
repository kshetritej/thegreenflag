import { cn } from "@/lib/utils"
import {  LucideIcon } from "lucide-react"

type InfoProps = {
  className?: string,
  message?: string,
  icon?: LucideIcon
}

export default function Info({ className, message, icon: Icon }: InfoProps) {
  return (
    <div className={cn("flex gap-2 text-black items-center  border border-red-600 bg-red-100 p-4 rounded-md m-1", className)}>
      {Icon &&
        <Icon className="h-4 w-4 " />
      }
      <p>{message || "Did you know? The AI generated description is not always accurate. Please review it before publishing."}</p>
    </div>
  )
}