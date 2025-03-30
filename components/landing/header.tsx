import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"
import { UploadButton } from "@uploadthing/react"

export default function Header() {
  const session = useSession()
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 bg-white">
      <div className="w-full max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
          Discover the Local's
          <br />
          top experiences
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore reviews from real people about the best places, services, and products
          <br />
          ready for your next adventure
        </p>

        <div className="mt-8 w-full max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full px-4 py-3 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-none border-y border-r border-gray-300 px-4 h-[50px]">
                  Places <span className="ml-1">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem>Places</DropdownMenuItem>
                <DropdownMenuItem>Services</DropdownMenuItem>
                <DropdownMenuItem>Products</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="rounded-r-full h-[50px] px-5">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <span className="text-sm text-gray-500 mr-2 mt-1">Trending searches:</span>
          {["restaurants", "hotels", "coffee shops", "electronics", "home services"].map((tag) => (
            <Button
              key={tag}
              variant="outline"
              className="rounded-full text-sm px-4 py-1 h-auto border-gray-200 hover:bg-gray-50"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

