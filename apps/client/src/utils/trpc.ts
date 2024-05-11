import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@repo/server';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',

      // You can pass any HTTP headers you wish here
      async headers() {
        return {
        };
      },
    }),
  ],
});
