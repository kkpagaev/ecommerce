import Fastify from "fastify";

import * as path from "path";
import { fastifyTRPCPlugin } from "./core/trpc";
import fastifyAutoload from "@fastify/autoload";
import poolPlugin from "@repo/pool";

export async function build() {
  const f = await Fastify({
    logger: true,
  });

  await f.register(poolPlugin);
  await f.register(fastifyAutoload, {
    dir: path.resolve(import.meta.dirname, "plugins"),
  });
  await f.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
  });

  f.get("/", () => {
    return {
      hello: "world",
    };
  });

  return f;
}
