// this file is generated
`[{"admin":{"account":{"discord":{"router":"AdminAccountDiscordRouter"},"router":"AdminAccountRouter"},"admin":{"auth":{"router":"AdminAdminAuthRouter"},"router":"AdminAdminRouter"},"catalog":{"attribute":{"router":"AdminCatalogAttributeRouter"},"category":{"router":"AdminCatalogCategoryRouter"},"option":{"router":"AdminCatalogOptionRouter"},"optionGroups":{"router":"AdminCatalogOptionGroupsRouter"},"product":{"router":"AdminCatalogProductRouter"}},"files":{"router":"AdminFilesRouter"},"language":{"router":"AdminLanguageRouter"}},"web":{"catalog":{"post":{"router":"WebCatalogPostRouter"}}}},[["AdminAccountDiscordRouter","./admin/account/discord/router"],["AdminAccountRouter","./admin/account/router"],["AdminAdminAuthRouter","./admin/admin/auth.router"],["AdminAdminRouter","./admin/admin/router"],["AdminCatalogAttributeRouter","./admin/catalog/attribute.router"],["AdminCatalogCategoryRouter","./admin/catalog/category.router"],["AdminCatalogOptionRouter","./admin/catalog/option.router"],["AdminCatalogOptionGroupsRouter","./admin/catalog/optionGroups.router"],["AdminCatalogProductRouter","./admin/catalog/product.router"],["AdminFilesRouter","./admin/files/router"],["AdminLanguageRouter","./admin/language/router"],["WebCatalogPostRouter","./web/catalog/post/router"]]]`;
import { FastifyZod } from "fastify";
import { withValidation } from "./core/trpc";
import AdminAccountDiscordRouter from "./admin/account/discord/router";
import AdminAccountRouter from "./admin/account/router";
import AdminAdminAuthRouter from "./admin/admin/auth.router";
import AdminAdminRouter from "./admin/admin/router";
import AdminCatalogAttributeRouter from "./admin/catalog/attribute.router";
import AdminCatalogCategoryRouter from "./admin/catalog/category.router";
import AdminCatalogOptionRouter from "./admin/catalog/option.router";
import AdminCatalogOptionGroupsRouter from "./admin/catalog/optionGroups.router";
import AdminCatalogProductRouter from "./admin/catalog/product.router";
import AdminFilesRouter from "./admin/files/router";
import AdminLanguageRouter from "./admin/language/router";
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
        option: withValidation(
          t.router(await AdminCatalogOptionRouter(fastify)),
        ),
        optionGroups: withValidation(
          t.router(await AdminCatalogOptionGroupsRouter(fastify)),
        ),
        product: withValidation(
          t.router(await AdminCatalogProductRouter(fastify)),
        ),
      }),
      files: withValidation(t.router(await AdminFilesRouter(fastify))),
      language: withValidation(t.router(await AdminLanguageRouter(fastify))),
    }),
    web: t.router({
      catalog: t.router({
        post: withValidation(t.router(await WebCatalogPostRouter(fastify))),
      }),
    }),
  });
}

export type AppRouter = Awaited<ReturnType<typeof createAppRouter>>;
