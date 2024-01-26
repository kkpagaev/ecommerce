import type { AppRouter } from "server/src/app.router";
import {
  createTRPCClient,
  httpBatchLink,
  createWSClient,
  wsLink,
} from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { NextPageContext } from "next";

function getEndingLink(ctx: NextPageContext | undefined) {
  if (typeof window === "undefined") {
    return httpBatchLink({
      url: "http://localhost:3000/trpc",
      headers() {
        if (!ctx?.req?.headers) {
          return {};
        }
        // on ssr, forward client's headers to the server
        return {
          ...ctx.req.headers,
          "x-ssr": "1",
        };
      },
    });
  }
  const client = createWSClient({
    url: "ws://localhost:3000/trpc",
  });
  return wsLink<AppRouter>({
    client,
  });
}

export const api = createTRPCClient<AppRouter>({
  links: [
    // getEndingLink(undefined),
    httpBatchLink({
      url: "http://localhost:3000/trpc",
    }),
  ],
});

export const trpc = createTRPCNext<AppRouter>({
  config(opts) {
    return {
      links: [getEndingLink(opts.ctx)],
    };
  },
  ssr: false,
});

export const adminApi = api.admin;
