import { Metadata } from "next"
import Header from "@/components/landing/header"
import Navbar from "@/components/navbar"

export const metadata: Metadata = {
  title: "The Green Flag",
  description: "Recommendation/review platform for informed and fast decision making for your next visit.",
}

export default function Homepage() {
  return(
    <div>
      <Navbar/>
      <Header/>
    </div>
  )
}