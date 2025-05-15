import { AppRouter } from "@/server/routers/_app"
import { createTRPCClient, createWSClient, wsLink } from "@trpc/client"
import SuperJSON from "superjson";

const wsClient = createWSClient({
  url: `ws://localhost:3000`,
  connectionParams: async () => {
    return {
      token: "supersecret",
    }
  },
})
export const trpc = createTRPCClient<AppRouter>({
  links: [wsLink({ client: wsClient, transformer: SuperJSON })],
});
