import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Flag, Search } from "lucide-react";

export default function Navbar() {
const navItems = [
    {
        name: "Discover",
        href: "/discover",
    },
    {
        name: "Reviews",
        href: "/reviews",
    },
    {
        name: "More",
        href: "/more",
    }
]
  return (
    <div className="bg-background p-4 flex justify-between">
        <div className="logo-and-search flex gap-2 items-center">
            <div className="logo font-bold text-lg">
                <Flag/>
            </div>
            <div className="relative">
            <Search className="absolute right-2 top-1 opacity-75"/>
            <Input placeholder="Search" />
            </div>
        </div>

        <div className="menu-items">
        {navItems.map((item, index) => (
            <Link key={index} href={item.href}>
                <Button variant="ghost">{item.name}</Button>
            </Link>
        ))}
        </div>
        <div className="login-and-signup flex gap-2 items-center">
            <SignedOut>
            <Link href={"/sign-in"}>
            <Button variant="outline">Login</Button>
            </Link>
            <Link href={"/sign-up"}>
            <Button>Sign Up</Button>
            </Link>
            </SignedOut>
            <SignedIn>
                <UserButton/>
            </SignedIn>
        </div>
    </div>
  )
}
