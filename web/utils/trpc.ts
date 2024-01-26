import type { AppRouter } from "server/src/app.router";
import {
  createTRPCClient,
  createWSClient,
  httpBatchLink,
  wsLink,
} from "@trpc/client";

const wsClient = createWSClient({
  url: `ws://localhost:3000`,
});

export const api = createTRPCClient<AppRouter>({
  links: [
    wsLink({
      client: wsClient,
    }),
    httpBatchLink({
      url: "http://localhost:3000/trpc",
    }),
  ],
});

export const clientApi = api.web;
