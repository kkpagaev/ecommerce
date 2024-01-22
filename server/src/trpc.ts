import { initTRPC } from "@trpc/server";

declare module "fastify" {
  interface FastifyInstance {
    trpc: typeof router;
    mergeRouters: typeof t.mergeRouters;
  }
}

export const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
