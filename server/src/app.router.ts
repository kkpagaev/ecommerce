// this file is generated
`[{"admin":{"account":{"discord":{"router":"AdminAccountDiscordRouter"},"router":"AdminAccountRouter"},"catalog":{"attribute":{"router":"AdminCatalogAttributeRouter"},"category":{"router":"AdminCatalogCategoryRouter"}}},"web":{"catalog":{"post":{"router":"WebCatalogPostRouter"}}}},[["AdminAccountDiscordRouter","./admin/account/discord/router"],["AdminAccountRouter","./admin/account/router"],["AdminCatalogAttributeRouter","./admin/catalog/attribute.router"],["AdminCatalogCategoryRouter","./admin/catalog/category.router"],["WebCatalogPostRouter","./web/catalog/post/router"]]]`;
import { FastifyInstance } from "fastify";
import { withValidation } from "./core/trpc";
import AdminAccountDiscordRouter from "./admin/account/discord/router";
import AdminAccountRouter from "./admin/account/router";
import AdminCatalogAttributeRouter from "./admin/catalog/attribute.router";
import AdminCatalogCategoryRouter from "./admin/catalog/category.router";
import WebCatalogPostRouter from "./web/catalog/post/router";

export async function createAppRouter(fastify: FastifyInstance) {
  const { t } = fastify;

  return t.router({
    admin: t.router({
      account: t.mergeRouters(
        withValidation(t.router(await AdminAccountRouter(fastify))),
        t.router({
          discord: withValidation(
            t.router(await AdminAccountDiscordRouter(fastify)),
          ),
        }),
      ),
      catalog: t.router({
        attribute: withValidation(
          t.router(await AdminCatalogAttributeRouter(fastify)),
        ),
        category: withValidation(
          t.router(await AdminCatalogCategoryRouter(fastify)),
        ),
      }),
    }),
    web: t.router({
      catalog: t.router({
        post: withValidation(t.router(await WebCatalogPostRouter(fastify))),
      }),
    }),
  });
}

export type AppRouter = Awaited<ReturnType<typeof createAppRouter>>;
