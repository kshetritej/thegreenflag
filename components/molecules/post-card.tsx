import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { LucideMessageSquare } from "lucide-react"

type PostCardProps = {
  title: string
  content: string
  author: string
  comments: number
  createdAt: Date
}

export default function PostCard({ title, content, author, comments, createdAt }: PostCardProps) {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <div className="flex gap-2 items-center">
          u/@{author}
        </div>
        <CardTitle className="flex justify-between items-center">{title}</CardTitle>
        <CardDescription>{content.substring(20) + "..."}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardFooter className="flex justify-between px-0">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
          <div className="flex gap-1 items-center">
            <LucideMessageSquare />
            {comments}
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  )
}