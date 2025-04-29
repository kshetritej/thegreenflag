import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { Tooltip, TooltipContent } from "../ui/tooltip"
import { Button } from "../ui/button"

type ToolTipProps = {
  content: React.ReactNode
  children: React.ReactNode
  isNotButton?: boolean
}
export default function MyToolTip({ content, children, isNotButton = false }: ToolTipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {!isNotButton &&
          <Button variant={'outline'} size={'icon'} className="hover:cursor-pointer">
            {children}
          </Button>
        }
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  )
}
//{isNotButton && <> children</>}
