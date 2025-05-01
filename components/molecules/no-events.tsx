import { Calendar } from "lucide-react"
import { Card, CardContent } from "../ui/card"

export default function NoEvent() {
  return (
    <div className="container mx-auto min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Events Found</h2>
          <p className="text-muted-foreground">This business hasn't created any events yet.</p>
        </CardContent>
      </Card>
    </div>
  )
}