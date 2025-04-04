"use client"

import type { Metadata } from "next"
import "./globals.css"
import { Mona_Sans } from "next/font/google"
import { EdgeStoreProvider } from "@/lib/edgestore"
import { Toaster } from "@/components/ui/sonner"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
})

// export const metadata: Metadata = {
//   title: "Green Flag - Discover the Local's top experiences",
//   description: "Explore reviews from real people about the best places, services, and products ready for your next adventure",
// }

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={monaSans.className}>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
          <EdgeStoreProvider>
              {children}
            <Toaster position="top-right" />
            </EdgeStoreProvider>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
