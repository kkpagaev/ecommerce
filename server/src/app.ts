import Fastify from "fastify";

import * as path from "path";
import { fastifyTRPCPlugin } from "./core/trpc";
import { FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";
import { createContext } from "./core/context";
import { AppRouter, createAppRouter } from "./app.router";
import fastifyCors from "@fastify/cors";
import fastifyWebsocket from "@fastify/websocket";
import { ZodTypeProvider, validatorCompiler, serializerCompiler } from "fastify-type-provider-zod";
import fastifyAutoload from "@fastify/autoload";

export async function build() {
  const f = Fastify({
    logger: true,
  });

  await f.register(fastifyAutoload, {
    dir: path.resolve(__dirname, "plugins"),
  });

  await f.register(fastifyWebsocket);

  f.setValidatorCompiler(validatorCompiler);
  f.setSerializerCompiler(serializerCompiler);

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
