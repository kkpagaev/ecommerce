// utils/trpc.ts
import {
  createTRPCClient,
  createTRPCReact,
  httpLink,
  type inferReactQueryProcedureOptions,
} from "@trpc/react-query";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../server/src/index";

export const trpc = createTRPCReact<AppRouter>();

export const api = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: "http://localhost:3000/trpc",
      headers: () => {
        return {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        };
      },
    }),
  ],
});

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type AdminOutputs = RouterOutputs["admin"];
