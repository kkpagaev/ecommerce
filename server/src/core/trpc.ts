import { AnyTRPCRouter, initTRPC } from "@trpc/server";
import {
  FastifyTRPCPluginOptions,
  fastifyRequestHandler,
} from "@trpc/server/adapters/fastify";
import { WSSHandlerOptions, applyWSSHandler } from "@trpc/server/adapters/ws";
import { FastifyInstance } from "fastify";
import { AppRouter, createAppRouter } from "../app.router";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createContext } from "./context";

declare module "fastify" {
  interface FastifyInstance {
    t: typeof t;
  }
}

export const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export async function fastifyTRPCPlugin<TRouter extends AnyTRPCRouter>(
  fastify: FastifyInstance,
  opts: { prefix?: string; useWSS?: boolean } = {},
) {
  fastify.removeContentTypeParser("application/json");
  fastify.addContentTypeParser(
    "application/json",
    { parseAs: "string" },
    function (_, body, _done) {
      _done(null, body);
    },
  );

  fastify.decorate("t", t);
  fastify.decorate("trpc", router);
  fastify.decorate("mergeRouters", t.mergeRouters);
  fastify.decorate("publicProcedure", publicProcedure);

  let prefix = opts.prefix ?? "";

  const appRouter = await createAppRouter(fastify.withTypeProvider<ZodTypeProvider>());

  const trpcOptions = {
    router: appRouter,
    createContext,
    onError({ path, error }) {
      console.error(`Error in tRPC handler on path '${path}':`, error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"];

  // https://github.com/fastify/fastify-plugin/blob/fe079bef6557a83794bf437e14b9b9edb8a74104/plugin.js#L11
  // @ts-expect-error property 'default' does not exists on type ...
  if (typeof fastifyTRPCPlugin.default !== "function") {
    prefix = ""; // handled by fastify internally
  }

  function handleServerValidationPath(path: string) {
    if (!path.endsWith("serverValidate")) {
      return path;
    }
    const trpcPath = path.split(".");

    // inserts validate before the lastt element
    // so when we call like category.createCategory.serverValidate
    // we "redirect" it to category.validate.createCategory
    const len = trpcPath.length;
    [trpcPath[len - 2], trpcPath[len - 1]] = ["validator", trpcPath[len - 2]];

    return trpcPath.join(".");
  }

  fastify.all(`${prefix}/:path`, async (req, res) => {
    const path = handleServerValidationPath(
      (req.params as any).path.toString(),
    );

    await fastifyRequestHandler({ ...trpcOptions, req, res, path });
  });

  if (opts.useWSS) {
    applyWSSHandler<TRouter>({
      ...(trpcOptions as unknown as WSSHandlerOptions<TRouter>),
      wss: fastify.websocketServer,
    });
    fastify.get(prefix ?? "/", { websocket: true }, () => {});
  }
}
