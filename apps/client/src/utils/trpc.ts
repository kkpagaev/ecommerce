// utils/trpc.ts
import {
  createTRPCClient,
  createTRPCReact,
  httpLink,
  type inferReactQueryProcedureOptions,
} from "@trpc/react-query";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@repo/server";

export const trpc = createTRPCReact<AppRouter>();
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: "http://localhost:3000/trpc",
      headers: async () => {
        if (true) {
          return {};
        }
        // const token = await getToken();
        //
        // return {
        //   authorization: `Bearer ${token}`,
        // };
      },
    }),
  ]
}
                                                     );

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type AdminOutputs = RouterOutputs["admin"];
export type AdminInputs = RouterInputs["admin"];
