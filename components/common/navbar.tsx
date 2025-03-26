import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const navLinks = ["Explore", "Get Lucky", "Find Jobs"]
  return (
    <nav className="flex w-full justify-between p-8 items-center border-b">
      <NavigationMenu className="flex justify-between w-full">
        <NavigationMenuItem className="list-none font-bold text-xl mr-8">
          <Link href={"/"}>GREENFLAG</Link>
        </NavigationMenuItem>
        <NavigationMenuList>
          <NavigationMenuItem className="flex gap-4">
            {navLinks.map((item) => {
              return (
                <NavigationMenuLink key={item} className="font-medium">
                  {item}
                </NavigationMenuLink>
              )
            })}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback>T</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[240px]">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Login</DropdownMenuItem>
          <DropdownMenuItem>Signup</DropdownMenuItem>
          <DropdownMenuItem><Link href={"/add-business"}>List a Business</Link></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </nav>
  )
}