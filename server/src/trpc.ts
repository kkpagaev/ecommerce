import { initTRPC } from "@trpc/server";

type PublicProcedure = typeof publicProcedure;

declare module "fastify" {
  interface FastifyInstance {
    trpc: typeof router;
    mergeRouters: typeof t.mergeRouters;
    publicProcedure: PublicProcedure;
  }
}

export const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
