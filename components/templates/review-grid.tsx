import Link from "next/link"
import ReviewCard from "../molecules/display-card"
import SimpleFilterBar from "../molecules/simple-filter-bar"

export default function ReviewGrid() {
  const reviews = [
    {
      image: "/res.jpg",
      title: "Himalayan Cafe",
      location: "Lalitpur, Nepal",
      rating: 4.96,
      isFavorite: true,
      distance: "1.2 miles away",
      category: "Restaurant",
    },
    {
      image: "/res.jpg",
      title: "Mountain View Hotel",
      location: "Pokhara, Nepal",
      rating: 4.85,
      isFavorite: true,
      distance: "0.5 miles away",
      category: "Hotel",
    },
    {
      image: "/res.jpg",
      title: "Artisan Craft Shop",
      location: "Bhaktapur, Nepal",
      rating: 4.7,
      isFavorite: false,
      distance: "3.4 miles away",
      category: "Shopping",
    },
    {
      image: "/res.jpg",
      title: "Everest Trekking Gear",
      location: "Kathmandu, Nepal",
      rating: 4.9,
      isFavorite: true,
      distance: "2.1 miles away",
      category: "Outdoor Equipment",
    },
  ]

  return (
    <>
      <SimpleFilterBar />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {reviews.map((review, index) => (
          <Link key={index} href={"/review"}>
            <ReviewCard key={index} {...review} />
          </Link>
        ))}
      </div>
    </>
  )
}

