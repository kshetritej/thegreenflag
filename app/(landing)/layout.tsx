"use client"
import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-[var(--font-geist-sans)]">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}
