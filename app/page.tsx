"use client"
import Navbar from "@/components/common/navbar"
import Header from "@/components/landing/header"
import BusinessGrid from "@/components/templates/business-grid"

export default function Home() {

  return (
    <div className="container mx-auto">
      <div>
        <Header />
        <BusinessGrid/>
      </div>
    </div>
  )
}