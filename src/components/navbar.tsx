import Image from "next/image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <div className="bg-background p-4 flex justify-between">
        <div className="logo-and-search flex gap-2 items-center">
            <div className="logo font-bold text-lg">
                <Image src="/thegreenflag_logo.png" width={80} height={80} alt="logo"/>
            </div>
            <Input placeholder="Search" />
        </div>

        <div className="menu-items">

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
