import Fastify from "fastify";

import * as path from "path";
import { fastifyTRPCPlugin } from "./core/trpc";
import { FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";
import { createContext } from "./core/context";
import { AppRouter, createAppRouter } from "./app.router";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import fastifyAutoload from "@fastify/autoload";

export async function build() {
  const f = Fastify({
    logger: true,
  });

  await f.register(fastifyAutoload, {
    dir: path.resolve(__dirname, "plugins"),
  });

  const appRouter = await createAppRouter(f.withTypeProvider<ZodTypeProvider>());

  await f.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    useWSS: true,
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }) {
        console.error(`Error in tRPC handler on path '${path}':`, error);
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
  });

  return f;
}
