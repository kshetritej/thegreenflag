import Navbar from "@/components/common/navbar"
import Header from "@/components/landing/header"
import ReviewGrid from "@/components/templates/review-grid"

export default function Home() {

  return (
    <div className="container mx-auto">
      <Navbar />
      <div>
        <Header />
        <ReviewGrid />
      </div>
    </div>
  )
}