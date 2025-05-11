'use client';
import './globals.css';
import { Toaster } from "react-hot-toast";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { trpc, trpcClient } from '../utils/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import NavBar from './_components/navbar';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <QueryClientProvider client={queryClient}>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
              <header className="flex justify-end items-center p-4 gap-4 h-16 border-b">
                <NavBar />
                <SignedOut>
                  <SignInButton />
                  <SignUpButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </header>

              <Toaster position="top-right" reverseOrder={false} />
              {children}
            </trpc.Provider>
          </QueryClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}