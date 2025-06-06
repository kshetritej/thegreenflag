"use client"

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, LandPlot, LucideLogOut, LucideUser, Calendar, Briefcase, Users } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/atoms/mode-toggle"

export const navLinks = [
  { name: "Explore", href: "/business/explore", icon: Globe }, 
  { name: "Find Jobs", href: "/job", icon: Briefcase },
  { name: "Community", href: "/community", icon: Users }
]

export default function Navbar() {
  const session = useSession()

  return (
    <nav className="flex mx-auto container justify-between py-4 items-center border-b">
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
            {navLinks.map(({name, href, icon:Icon}) => {
              return (
                <NavigationMenuLink href={href} key={href} className="font-medium flex flex-row gap-2 items-center">
                  <Icon className="size-4 hover:text-primary" />
                  <span>
                    {name}
                  </span>
                </NavigationMenuLink>
              )
            })}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {session.status === "authenticated" && 
        <div className="flex gap-2 items-center">
        <DropdownMenu>
            <DropdownMenuTrigger className="flex gap-2 items-center" asChild>
              <Button variant={"outline"} size={'icon'} className="shadow-none">
                <LucideUser className="size-4" />
              </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[240px]">
              <DropdownMenuLabel>
                <p className="uppercase">
                  {session.data?.user?.name}
                </p>
                <p>{session.data?.user?.email}</p>
              </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={"/profile"}>
                <DropdownMenuItem>
                  <Button variant={"ghost"} className="w-full flex gap-2 items-center justify-between px-0">
                    <p className="uppercase">Profile</p>
                    <LucideUser className="size-4" />
                  </Button>
                </DropdownMenuItem>
          </Link>
            {session.status === "authenticated" && (
                <DropdownMenuItem onClick={() => signOut()}>
                  <Button variant={"ghost"} className="w-full flex gap-2 items-center justify-between px-0">
                    <p className="uppercase">Logout</p>
                    <LucideLogOut className="size-4" />
                  </Button>
                </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
          <ModeToggle />
        </div>
      }

      {!session || session.status === "unauthenticated"  &&
        <div className="flex gap-2">
          <Button variant={"secondary"} className="shadow-none">
            <Link href={"/signup"} className="uppercase">Signup</Link>
          </Button>
          <Button className="shadow-none">
            <Link href={"/login"} className="uppercase">Login</Link>
          </Button>
          <ModeToggle />
        </div>
      }

    </nav>
  )
}