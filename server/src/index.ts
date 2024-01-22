import Fastify from "fastify";

import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import { Pool } from "pg";
import { createContext } from "./context";
import { AppRouter, createAppRouter } from "./app.router";
import { router, t } from "./trpc";
import { updateRoutes } from "./router.gen";

declare module "fastify" {
  interface FastifyInstance {
    trpc: typeof router;
    mergeRouters: typeof t.mergeRouters;
  }
}

async function main() {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "dev";
  }
  if (process.env.NODE_ENV === "dev") {
    await updateRoutes();
  }

  const f = Fastify({
    logger: true,
  });
  f.decorate("trpc", router);
  f.decorate("mergeRouters", t.mergeRouters);
  const appRouter = await createAppRouter(f);

  await f.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }) {
        console.error(`Error in tRPC handler on path '${path}':`, error);
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
  });
  const pool = new Pool({
    connectionString: "postgresql://user:user@localhost:1252/user",
  });

  await pool.connect();

  f.get("/", async () => {
    return {
      hello: "world",
    };
  });

  await f.listen({
    port: 3000,
  });
}

void main();
