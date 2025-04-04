"use client"
import Header from "@/components/landing/header"
import BusinessGrid from "@/components/landing/business-grid"

export default function Home() {

  return (
    <div className="container mx-auto">
        <Header />
        <BusinessGrid/>
    </div>
  )
}