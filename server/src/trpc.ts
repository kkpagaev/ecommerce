import { AnyTRPCRouter, initTRPC } from "@trpc/server";
import {
  FastifyTRPCPluginOptions,
  fastifyRequestHandler,
} from "@trpc/server/adapters/fastify";
import { FastifyInstance } from "fastify";

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

export function fastifyTRPCPlugin<TRouter extends AnyTRPCRouter>(
  fastify: FastifyInstance,
  opts: FastifyTRPCPluginOptions<TRouter>,
  done: (err?: Error) => void,
) {
  fastify.removeContentTypeParser("application/json");
  fastify.addContentTypeParser(
    "application/json",
    { parseAs: "string" },
    function (_, body, _done) {
      _done(null, body);
    },
  );

  let prefix = opts.prefix ?? "";

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
    console.log(path);

    await fastifyRequestHandler({ ...opts.trpcOptions, req, res, path });
  });

  // if (opts.useWSS) {
  //   applyWSSHandler<TRouter>({
  //     ...(opts.trpcOptions as unknown as WSSHandlerOptions<TRouter>),
  //     wss: fastify.websocketServer,
  //   });
  //   // eslint-disable-next-line @typescript-eslint/no-empty-function
  //   fastify.get(prefix ?? "/", { websocket: true }, () => {});
  // }

  done();
}
