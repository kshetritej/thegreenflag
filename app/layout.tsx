"use client"

import "./globals.css"
import { Geist_Mono } from "next/font/google"
import { EdgeStoreProvider } from "@/lib/edgestore"
import { Toaster } from "@/components/ui/sonner"
import { SessionProvider, useSession } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
    <html lang="en" className="dark">
      <body className={` ${geistMono.variable} font-sans tracking-loose `}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <QueryClientProvider client={queryClient}>
                <EdgeStoreProvider>
                  {children}
                  <Toaster position="bottom-center" />
                </EdgeStoreProvider>
              </QueryClientProvider>
            </TooltipProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
