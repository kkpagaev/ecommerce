import { Pool } from "pg";
import { router, t } from "./core/trpc";
import { updateRoutes } from "./router.gen";
import { build } from "./app";

declare module "fastify" {
  interface FastifyInstance {
    trpc: typeof router;
    mergeRouters: typeof t.mergeRouters;
    pool: Pool;
  }
}

async function main() {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "dev";
  }
  if (process.env.NODE_ENV === "dev") {
    await updateRoutes();
  }
  const f = await build();

  await f.listen({
    port: 3000,
  });
}

void main();
