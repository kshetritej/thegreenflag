import type { Metadata } from "next"
import "./globals.css"
import { Mona_Sans } from "next/font/google"
import Providers from "@/components/providers/ClientProvider"
import { EdgeStoreProvider } from "@/lib/edgestore"
import { Toaster } from "@/components/ui/sonner"

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Green Flag - Discover the Local's top experiences",
  description: "Explore reviews from real people about the best places, services, and products ready for your next adventure",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={monaSans.className}>
        <Providers>
          <EdgeStoreProvider>
        {children}
            <Toaster position="top-right" />
          </EdgeStoreProvider>
        </Providers>
      </body>
    </html>
  )
}
