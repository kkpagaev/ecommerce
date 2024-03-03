import { updateRoutes } from "./router.gen";
import { build } from "./app";
import { AppRouter } from "./app.router";

// process.env.NODE_ENV = "production";

async function main() {
  await updateRoutes();
  const f = await build();

  await f.listen({
    port: 3000,
  });
}

void main();

export type { AppRouter };
