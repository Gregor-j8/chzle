
// import { ClerkProvider } from "@clerk/nextjs";
import { trpc, trpcClient } from "../utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProps } from "next/app";


const client = new QueryClient();

function HomePage({ Component, pageProps }: AppProps) {
  return (
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default HomePage;
