import { AnyTRPCRouter, TRPCError, initTRPC } from "@trpc/server";
import {
  FastifyTRPCPluginOptions,
  fastifyRequestHandler,
} from "@trpc/server/adapters/fastify";
import { WSSHandlerOptions, applyWSSHandler } from "@trpc/server/adapters/ws";
import { FastifyInstance, FastifyRequest } from "fastify";
import { AppRouter, createAppRouter } from "../app.router";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createContext, Context } from "./context";
import { ZodSchema } from "zod";
import { getAuth, User } from "@clerk/fastify";

declare module "fastify" {
  interface FastifyInstance {
    t: typeof t;
  }
}

export const t = initTRPC.context<Context>().create();

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
  const clerkClient = fastify.clerkClient;

  const trpcOptions = {
    router: appRouter,
    createContext: createContext.bind(null, async (req) => {
      const auth = getAuth(req);

      const userId = auth.userId;
      const user = userId ? await clerkClient.users.getUser(auth.userId) : null;

      return user;
    }),
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
    trpcPath[len - 2] = "validate";
    trpcPath[len - 1] = trpcPath[len - 2] || "";

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

// export function withValidation<T extends AnyTRPCRouter>(router: T) {
//   const methods = Object.keys(router).filter(
//     (key) => !["_def", "createCaller"].includes(key),
//   );
//
//   const validator = t.router(
//     methods.reduce((acc, key) => {
//       const method = router[key];
//       const inputs = method._def.inputs;
//
//       const resolver = (req: any) => {
//         const body = req.ctx.req.body;
//         console.log(body);
//
//         let json = JSON.parse(body);
//         json = 0 in json ? json[0] : json;
//
//         const res = inputs.map((i: ZodSchema) => i.safeParse(json));
//         return res;
//       };
//       resolver._def = method._def;
//
//       acc[key] = resolver;
//       return acc;
//     }, {} as any),
//   );
//
//   return t.mergeRouters(
//     t.router({
//       validator: validator as T,
//     }),
//     router,
//   );
// }

export const isAuthed = t.middleware((
  opts
) => {
  const { ctx } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      user: ctx.user,
    },
  });
});
