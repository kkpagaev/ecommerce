import Fastify from "fastify";

import { fastifyTRPCPlugin } from "./core/trpc";

import { FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";
import { Pool } from "pg";
import { createContext } from "./core/context";
import { AppRouter, createAppRouter } from "./app.router";
import { publicProcedure, router, t } from "./core/trpc";
import fastifyCors from "@fastify/cors";
import fastifyWebsocket from "@fastify/websocket";

export async function build() {
  const f = Fastify({
    logger: true,
  });
  const pool = new Pool({
    connectionString: "postgresql://user:user@localhost:1252/user",
  });

  await f.register(fastifyWebsocket);
  f.decorate("pool", pool);
  f.decorate("t", t);
  f.decorate("trpc", router);
  f.decorate("mergeRouters", t.mergeRouters);
  f.decorate("publicProcedure", publicProcedure);

  const appRouter = await createAppRouter(f);

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

  await pool.connect();

  await f.register(fastifyCors, {
    origin: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  });

  f.get("/", async () => {
    return {
      hello: "world",
    };
  });

  return f;
}
