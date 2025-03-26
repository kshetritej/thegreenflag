import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import Link from "next/link"

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

      <Avatar>
        <AvatarFallback>T</AvatarFallback>
      </Avatar>
    </nav>
  )
}