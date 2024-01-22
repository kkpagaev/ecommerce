import type { AppRouter } from "server/src/app.router";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/trpc",
    }),
  ],
});
