"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LandPlot, LucideUser } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

export default function Navbar() {
  const session = useSession()

  const navLinks = [{ name: "Explore", href: "/business/explore" }, { name: "Get Lucky", href: "/business/get-lucky" }, { name: "Find Jobs", href: "/business/find-jobs" }]

  return (
    <nav className="flex w-full justify-between p-8 items-center border-b">
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
          <NavigationMenuItem className="flex gap-4">
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

      <DropdownMenu>
        <DropdownMenuTrigger>
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
          {session.status === "authenticated" ? (
            <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
          ) : (
            <>
              <Link href={"/signup"}>
                <DropdownMenuItem>Signup</DropdownMenuItem>
              </Link>
              <Link href={"/login"}>
                <DropdownMenuItem>Signin</DropdownMenuItem>
              </Link>
            </>
          )}
          <DropdownMenuItem><Link href={"/business"}>List a Business</Link></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}