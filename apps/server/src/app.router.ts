// this file is generated
`[{"admin":{"account":{"discord":{"router":"AdminAccountDiscordRouter"},"router":"AdminAccountRouter"},"admin":{"auth":{"router":"AdminAdminAuthRouter"},"router":"AdminAdminRouter"},"catalog":{"attribute":{"router":"AdminCatalogAttributeRouter"},"category":{"router":"AdminCatalogCategoryRouter"},"product":{"router":"AdminCatalogProductRouter"}}},"web":{"catalog":{"post":{"router":"WebCatalogPostRouter"}}}},[["AdminAccountDiscordRouter","./admin/account/discord/router"],["AdminAccountRouter","./admin/account/router"],["AdminAdminAuthRouter","./admin/admin/auth.router"],["AdminAdminRouter","./admin/admin/router"],["AdminCatalogAttributeRouter","./admin/catalog/attribute.router"],["AdminCatalogCategoryRouter","./admin/catalog/category.router"],["AdminCatalogProductRouter","./admin/catalog/product.router"],["WebCatalogPostRouter","./web/catalog/post/router"]]]`;
import { FastifyZod } from "fastify";
import { withValidation } from "./core/trpc";
import AdminAccountDiscordRouter from "./admin/account/discord/router";
import AdminAccountRouter from "./admin/account/router";
import AdminAdminAuthRouter from "./admin/admin/auth.router";
import AdminAdminRouter from "./admin/admin/router";
import AdminCatalogAttributeRouter from "./admin/catalog/attribute.router";
import AdminCatalogCategoryRouter from "./admin/catalog/category.router";
import AdminCatalogProductRouter from "./admin/catalog/product.router";
import WebCatalogPostRouter from "./web/catalog/post/router";

export async function createAppRouter(fastify: FastifyZod) {
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
      admin: t.mergeRouters(
        withValidation(t.router(await AdminAdminRouter(fastify))),
        t.router({
          auth: withValidation(t.router(await AdminAdminAuthRouter(fastify))),
        }),
      ),
      catalog: t.router({
        attribute: withValidation(
          t.router(await AdminCatalogAttributeRouter(fastify)),
        ),
        category: withValidation(
          t.router(await AdminCatalogCategoryRouter(fastify)),
        ),
        product: withValidation(
          t.router(await AdminCatalogProductRouter(fastify)),
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
