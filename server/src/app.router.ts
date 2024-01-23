// this file is generated
`[{"admin":{"account":{"discord":{"router":"AdminAccountDiscordRouter"},"router":"AdminAccountRouter"},"catalog":{"category":{"router":"AdminCatalogCategoryRouter"}}},"web":{"catalog":{}}},[["AdminAccountDiscordRouter","./admin/account/discord/router"],["AdminAccountRouter","./admin/account/router"],["AdminCatalogCategoryRouter","./admin/catalog/category.router"]]]`;
import { FastifyInstance } from "fastify";
import { withValidation } from "./utils";
import AdminAccountDiscordRouter from "./admin/account/discord/router";
import AdminAccountRouter from "./admin/account/router";
import AdminCatalogCategoryRouter from "./admin/catalog/category.router";

export async function createAppRouter(fastify: FastifyInstance) {
  return fastify.trpc({
    admin: fastify.trpc({
      account: fastify.mergeRouters(
        withValidation(await AdminAccountRouter(fastify)),
        fastify.trpc({
          discord: withValidation(await AdminAccountDiscordRouter(fastify)),
        }),
      ),
      catalog: fastify.trpc({
        category: withValidation(await AdminCatalogCategoryRouter(fastify)),
      }),
    }),
    web: fastify.trpc({ catalog: fastify.trpc({}) }),
  });
}

export type AppRouter = Awaited<ReturnType<typeof createAppRouter>>;
