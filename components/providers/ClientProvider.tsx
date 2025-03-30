'use client'

import { SessionProvider } from "next-auth/react"
import Navbar from "@/components/common/navbar"
import { QueryClientProvider } from "@tanstack/react-query"
import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>
    <QueryClientProvider client={queryClient}>
    <Navbar/>
    {children}
    </QueryClientProvider>
    </SessionProvider>
}