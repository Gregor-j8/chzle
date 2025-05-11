'use client';
import './globals.css';
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from '@clerk/nextjs';
import { trpc, trpcClient } from '../utils/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import NavBar from './_components/navbar';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ClerkProvider>
      <html lang="en">
        <body className="box-border border-gray-200 bg-gray-100 min-h-screen">
          <QueryClientProvider client={queryClient}>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
              <Toaster position="top-right" reverseOrder={false} />
              <NavBar />
              {children}
            </trpc.Provider>
          </QueryClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}