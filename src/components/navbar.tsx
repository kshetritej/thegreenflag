import { Button } from "./ui/button";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Flag } from "lucide-react";

export default async function Navbar() {
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
    <div className="container mx-auto bg-background p-4 flex justify-between">
        <div className="logo-and-search flex gap-2 items-center">
            <div className="logo font-bold text-lg">
                <Flag/>
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
            <Button variant="secondary">Login</Button>
            </Link>
            <Link href={"/sign-up"}>
            <Button size={'lg'}>Sign Up</Button>
            </Link>
            </SignedOut>
            <SignedIn>
                <UserButton/>
            </SignedIn>
        </div>
    </div>
  )
}
