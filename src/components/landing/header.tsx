import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

export default function Header() {
    return (
        <div className="w-screen flex flex-col justify-center items-center">
            <h1 className="text-2xl  font-bold">Where to?</h1>
            <div className="relative">
            <Input size={40} className="py-6 m-4" />
            <Button size={'lg'} className="absolute -right-2 top-5">Search</Button>
            </div>
        </div>
    )
}