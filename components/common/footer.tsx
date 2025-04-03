import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { LandPlot } from "lucide-react"

export default function Footer() {
  return (
    <footer className="p-4 bg-foreground-accent border-t">
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <div className="size-10 rounded-2xl bg-lime-600 flex items-center justify-center">
              <LandPlot className="text-white" />
            </div>
            <span className="text-xl font-bold">Green Flag</span>
          </div>

          <p className="text-muted-foreground">Discover trusted experiences, verified by the community.</p>
        </div>

        <Separator className="mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                  Places near me
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                  Explore Spaces
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                  Get lucky
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-sm">Discover</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                  Within 50 miles
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                  Within 60 miles
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-sm">Opportunities</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                  Find jobs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                  Green Flag Award 2025
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-sm">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                  Cookie policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                  Legal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Green Flag. All rights reserved.
          </p>

          <div className="mt-4 md:mt-0 flex items-center">
            <div className="size-3 rounded-full bg-lime-500 mr-2" /> <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}