import Fastify from "fastify";

import * as path from "path";
import { fastifyTRPCPlugin } from "./core/trpc";
import fastifyAutoload from "@fastify/autoload";

export async function build() {
  const f = await Fastify({
    logger: true,
  });

  await f.register(fastifyAutoload, {
    dir: path.resolve(__dirname, "plugins"),
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
