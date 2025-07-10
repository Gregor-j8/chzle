'use client'
import './globals.css'
import { Toaster } from "react-hot-toast"
import { ClerkProvider } from '@clerk/nextjs'
import { trpc, trpcClient } from '../utils/trpc'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import NavBar from './_components/navbar'
import { PostHogProvider } from './providers'


export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
<ClerkProvider>
  <html lang="en" className="text-white">
    <body className="box-border bg-gray-900 text-white min-h-screen">
      <PostHogProvider>
        <QueryClientProvider client={queryClient}>
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="flex flex-col h-screen overflow-hidden">
              <NavBar />
              <main className="flex-1 overflow-auto pt-16">
                {children}
              </main>
            </div>
          </trpc.Provider>
        </QueryClientProvider>
      </PostHogProvider>
    </body>
  </html>
</ClerkProvider>
  )
}