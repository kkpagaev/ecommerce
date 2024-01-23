// this file is generated
`[{"admin":{"account":{"discord":{"router":"AdminAccountDiscordRouter"},"router":"AdminAccountRouter"},"catalog":{"category":{"router":"AdminCatalogCategoryRouter"}}},"web":{"catalog":{}}},[["AdminAccountDiscordRouter","./admin/account/discord/router"],["AdminAccountRouter","./admin/account/router"],["AdminCatalogCategoryRouter","./admin/catalog/category.router"]]]`;
import { FastifyInstance } from "fastify";
import AdminAccountDiscordRouter from "./admin/account/discord/router";
import AdminAccountRouter from "./admin/account/router";
import AdminCatalogCategoryRouter from "./admin/catalog/category.router";
import { t } from "./trpc";
import { AnyTRPCRouter } from "@trpc/server";

function test<T extends AnyTRPCRouter>(router: T) {
  const methods = Object.keys(router as any).filter(
    (key) => !["_def", "createCaller"].includes(key),
  );

  const validator = t.router(
    methods.reduce((acc, key) => {
      const method = (router as any)[key];

      const resolver = () => {
        return "success";
      };
      resolver._def = method._def;
      resolver._def.resolver = resolver;

      acc[key] = resolver;
      return acc;
    }, {} as any),
  );

  return t.mergeRouters(
    t.router({
      validator: validator as T,
    }),
    router,
  );
}

export async function createAppRouter(fastify: FastifyInstance) {
  return fastify.trpc({
    admin: fastify.trpc({
      account: fastify.mergeRouters(
        await AdminAccountRouter(fastify),
        fastify.trpc({ discord: await AdminAccountDiscordRouter(fastify) }),
      ),
      catalog: fastify.trpc({
        category: test(await AdminCatalogCategoryRouter(fastify)),
      }),
    }),
    web: fastify.trpc({ catalog: fastify.trpc({}) }),
  });
}

export type AppRouter = Awaited<ReturnType<typeof createAppRouter>>;
