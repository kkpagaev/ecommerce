// this file is generated
`[{"admin":{"account":{"discord":{"router":"AdminAccountDiscordRouter"},"router":"AdminAccountRouter"},"admin":{"auth":{"router":"AdminAdminAuthRouter"},"router":"AdminAdminRouter"},"catalog":{"attribute":{"router":"AdminCatalogAttributeRouter"},"attributeGroup":{"router":"AdminCatalogAttributeGroupRouter"},"category":{"router":"AdminCatalogCategoryRouter"},"option":{"router":"AdminCatalogOptionRouter"},"optionGroups":{"router":"AdminCatalogOptionGroupsRouter"},"product":{"router":"AdminCatalogProductRouter"}},"files":{"router":"AdminFilesRouter"},"inventory":{"location":{"router":"AdminInventoryLocationRouter"},"stocks":{"router":"AdminInventoryStocksRouter"}},"language":{"router":"AdminLanguageRouter"}},"web":{"catalog":{"post":{"router":"WebCatalogPostRouter"}}}},[["AdminAccountDiscordRouter","./admin/account/discord/router"],["AdminAccountRouter","./admin/account/router"],["AdminAdminAuthRouter","./admin/admin/auth.router"],["AdminAdminRouter","./admin/admin/router"],["AdminCatalogAttributeRouter","./admin/catalog/attribute.router"],["AdminCatalogAttributeGroupRouter","./admin/catalog/attributeGroup.router"],["AdminCatalogCategoryRouter","./admin/catalog/category.router"],["AdminCatalogOptionRouter","./admin/catalog/option.router"],["AdminCatalogOptionGroupsRouter","./admin/catalog/optionGroups.router"],["AdminCatalogProductRouter","./admin/catalog/product.router"],["AdminFilesRouter","./admin/files/router"],["AdminInventoryLocationRouter","./admin/inventory/location.router"],["AdminInventoryStocksRouter","./admin/inventory/stocks.router"],["AdminLanguageRouter","./admin/language/router"],["WebCatalogPostRouter","./web/catalog/post/router"]]]`;
import { FastifyZod } from "fastify";
import AdminAccountDiscordRouter from "./admin/account/discord/router";
import AdminAccountRouter from "./admin/account/router";
import AdminAdminAuthRouter from "./admin/admin/auth.router";
import AdminAdminRouter from "./admin/admin/router";
import AdminCatalogAttributeRouter from "./admin/catalog/attribute.router";
import AdminCatalogAttributeGroupRouter from "./admin/catalog/attributeGroup.router";
import AdminCatalogCategoryRouter from "./admin/catalog/category.router";
import AdminCatalogOptionRouter from "./admin/catalog/option.router";
import AdminCatalogOptionGroupsRouter from "./admin/catalog/optionGroups.router";
import AdminCatalogProductRouter from "./admin/catalog/product.router";
import AdminFilesRouter from "./admin/files/router";
import AdminInventoryLocationRouter from "./admin/inventory/location.router";
import AdminInventoryStocksRouter from "./admin/inventory/stocks.router";
import AdminLanguageRouter from "./admin/language/router";
import WebCatalogPostRouter from "./web/catalog/post/router";

export async function createAppRouter(fastify: FastifyZod) {
  const { t } = fastify;

  return t.router({
    admin: t.router({
      account: t.mergeRouters(
        t.router(await AdminAccountRouter(fastify)),
        t.router({
          discord: t.router(await AdminAccountDiscordRouter(fastify)),
        }),
      ),
      admin: t.mergeRouters(
        t.router(await AdminAdminRouter(fastify)),
        t.router({ auth: t.router(await AdminAdminAuthRouter(fastify)) }),
      ),
      catalog: t.router({
        attribute: t.router(await AdminCatalogAttributeRouter(fastify)),
        attributeGroup: t.router(
          await AdminCatalogAttributeGroupRouter(fastify),
        ),
        category: t.router(await AdminCatalogCategoryRouter(fastify)),
        option: t.router(await AdminCatalogOptionRouter(fastify)),
        optionGroups: t.router(await AdminCatalogOptionGroupsRouter(fastify)),
        product: t.router(await AdminCatalogProductRouter(fastify)),
      }),
      files: t.router(await AdminFilesRouter(fastify)),
      inventory: t.router({
        location: t.router(await AdminInventoryLocationRouter(fastify)),
        stocks: t.router(await AdminInventoryStocksRouter(fastify)),
      }),
      language: t.router(await AdminLanguageRouter(fastify)),
    }),
    web: t.router({
      catalog: t.router({
        post: t.router(await WebCatalogPostRouter(fastify)),
      }),
    }),
  });
}

export type AppRouter = Awaited<ReturnType<typeof createAppRouter>>;
