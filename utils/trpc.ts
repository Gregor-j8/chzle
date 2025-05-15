import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server/routers/_app';
import { createWSClient, wsLink } from '@trpc/client';
import { httpBatchLink } from '@trpc/client';
import { splitLink } from '@trpc/client';
import superjson from 'superjson';

export const trpc = createTRPCReact<AppRouter>();
const wsClient = createWSClient({
  url: 'ws://localhost:3001',
})

export const trpcClient = trpc.createClient({
  links: [
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: wsLink({
        client: wsClient,
        transformer: superjson,
      }),
      false: httpBatchLink({
        url: '/api/trpc',
        transformer: superjson,
      }),
    }),
  ],
});