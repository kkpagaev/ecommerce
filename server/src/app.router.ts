// this file is generated
`[{"admin":{"account":{"discord":{"router":"AdminAccountDiscordRouter"},"router":"AdminAccountRouter"},"catalog":{"category":{"router":"AdminCatalogCategoryRouter"}}},"web":{"catalog":{}}},[["AdminAccountDiscordRouter","./admin/account/discord/router"],["AdminAccountRouter","./admin/account/router"],["AdminCatalogCategoryRouter","./admin/catalog/category.router"]]]`;
import { FastifyInstance } from "fastify";
import AdminAccountDiscordRouter from "./admin/account/discord/router";
import AdminAccountRouter from "./admin/account/router";
import AdminCatalogCategoryRouter from "./admin/catalog/category.router";

export async function createAppRouter(fastify: FastifyInstance) {
  return fastify.trpc({
    admin: fastify.trpc({
      account: fastify.mergeRouters(
        await AdminAccountRouter(fastify),
        fastify.trpc({ discord: await AdminAccountDiscordRouter(fastify) }),
      ),
      catalog: fastify.trpc({
        category: await AdminCatalogCategoryRouter(fastify),
      }),
    }),
    web: fastify.trpc({ catalog: fastify.trpc({}) }),
  });
}

export type AppRouter = Awaited<ReturnType<typeof createAppRouter>>;
