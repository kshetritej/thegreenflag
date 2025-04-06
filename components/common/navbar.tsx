"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LandPlot, LucideUser } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "../ui/button"

export const navLinks = [{ name: "Explore", href: "/business/explore" }, { name: "Get Lucky", href: "/business/get-lucky" }, { name: "Find Jobs", href: "/business/find-jobs" }]

export default function Navbar() {
  const session = useSession()

  return (
    <nav className="flex mx-auto container justify-between p-4  items-center">
      <NavigationMenu className="flex justify-between w-full">
        <NavigationMenuItem className="list-none font-bold text-xl mr-8">
          <Link href={"/"} className="flex gap-1 items-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <LandPlot className="size-4" /> 
            </div>
            Green Flag
          </Link>
        </NavigationMenuItem>
        <NavigationMenuList>
          <NavigationMenuItem className="hidden md:flex gap-4">
            {navLinks.map((item) => {
              return (
                <NavigationMenuLink href={item.href} key={item.href} className="font-medium">
                    {item.name}
                </NavigationMenuLink>
              )
            })}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {session.status === "authenticated" && 
        <DropdownMenu>
        <DropdownMenuTrigger className="flex gap-2 items-center">
            <p className="hidden md:block">
        {session.data?.user?.name}
            </p>
          <Avatar>
            {session?.data?.user?.image &&
              <AvatarImage src={session?.data?.user?.image} />
            }
            {!session?.data?.user?.image &&
              <AvatarFallback>
                <LucideUser className="size-4" />
              </AvatarFallback>
            }
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[240px]">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={"/profile"}>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
            {session.status === "authenticated" && (
              <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
          )}
          <DropdownMenuItem><Link href={"/business"}>List a Business</Link></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      }

      {!session || session.status === "unauthenticated"  &&
        <div className="flex gap-2">
          <Button variant={"secondary"}>
            <Link href={"/signup"}>Signup</Link>
          </Button>
          <Button>
            <Link href={"/login"}>Login</Link>
          </Button>
        </div>
      }

    </nav>
  )
}