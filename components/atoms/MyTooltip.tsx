import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { Tooltip, TooltipContent } from "../ui/tooltip"

type ToolTipProps = {
  content: React.ReactNode
  children: React.ReactNode
}

export default function MyToolTip({ content, children }: ToolTipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  )
}
