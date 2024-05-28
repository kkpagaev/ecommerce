// this file is generated
`[{"admin":{"account":{"discord":{"router":"AdminAccountDiscordRouter"},"router":"AdminAccountRouter"},"admin":{"auth":{"router":"AdminAdminAuthRouter"},"router":"AdminAdminRouter"},"catalog":{"attribute":{"router":"AdminCatalogAttributeRouter"},"attributeGroup":{"router":"AdminCatalogAttributeGroupRouter"},"category":{"router":"AdminCatalogCategoryRouter"},"exports":{"router":"AdminCatalogExportsRouter"},"option":{"router":"AdminCatalogOptionRouter"},"optionGroups":{"router":"AdminCatalogOptionGroupsRouter"},"product":{"router":"AdminCatalogProductRouter"},"productVariant":{"router":"AdminCatalogProductVariantRouter"}},"files":{"router":"AdminFilesRouter"},"language":{"router":"AdminLanguageRouter"},"orders":{"router":"AdminOrdersRouter"},"vendor":{"router":"AdminVendorRouter"}},"web":{"catalog":{"category":{"router":"WebCatalogCategoryRouter"},"post":{"router":"WebCatalogPostRouter"},"product":{"router":"WebCatalogProductRouter"}},"languages":{"router":"WebLanguagesRouter"},"order":{"router":"WebOrderRouter"}}},[["AdminAccountDiscordRouter","./admin/account/discord/router"],["AdminAccountRouter","./admin/account/router"],["AdminAdminAuthRouter","./admin/admin/auth.router"],["AdminAdminRouter","./admin/admin/router"],["AdminCatalogAttributeRouter","./admin/catalog/attribute.router"],["AdminCatalogAttributeGroupRouter","./admin/catalog/attributeGroup.router"],["AdminCatalogCategoryRouter","./admin/catalog/category.router"],["AdminCatalogExportsRouter","./admin/catalog/exports.router"],["AdminCatalogOptionRouter","./admin/catalog/option.router"],["AdminCatalogOptionGroupsRouter","./admin/catalog/optionGroups.router"],["AdminCatalogProductRouter","./admin/catalog/product.router"],["AdminCatalogProductVariantRouter","./admin/catalog/productVariant.router"],["AdminFilesRouter","./admin/files/router"],["AdminLanguageRouter","./admin/language/router"],["AdminOrdersRouter","./admin/orders/router"],["AdminVendorRouter","./admin/vendor/router"],["WebCatalogCategoryRouter","./web/catalog/category.router"],["WebCatalogPostRouter","./web/catalog/post/router"],["WebCatalogProductRouter","./web/catalog/product.router"],["WebLanguagesRouter","./web/languages/router"],["WebOrderRouter","./web/order/router"]]]`;
import { FastifyZod } from "fastify";
import AdminAccountDiscordRouter from "./admin/account/discord/router";
import AdminAccountRouter from "./admin/account/router";
import AdminAdminAuthRouter from "./admin/admin/auth.router";
import AdminAdminRouter from "./admin/admin/router";
import AdminCatalogAttributeRouter from "./admin/catalog/attribute.router";
import AdminCatalogAttributeGroupRouter from "./admin/catalog/attributeGroup.router";
import AdminCatalogCategoryRouter from "./admin/catalog/category.router";
import AdminCatalogExportsRouter from "./admin/catalog/exports.router";
import AdminCatalogOptionRouter from "./admin/catalog/option.router";
import AdminCatalogOptionGroupsRouter from "./admin/catalog/optionGroups.router";
import AdminCatalogProductRouter from "./admin/catalog/product.router";
import AdminCatalogProductVariantRouter from "./admin/catalog/productVariant.router";
import AdminFilesRouter from "./admin/files/router";
import AdminLanguageRouter from "./admin/language/router";
import AdminOrdersRouter from "./admin/orders/router";
import AdminVendorRouter from "./admin/vendor/router";
import WebCatalogCategoryRouter from "./web/catalog/category.router";
import WebCatalogPostRouter from "./web/catalog/post/router";
import WebCatalogProductRouter from "./web/catalog/product.router";
import WebLanguagesRouter from "./web/languages/router";
import WebOrderRouter from "./web/order/router";

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
        exports: t.router(await AdminCatalogExportsRouter(fastify)),
        option: t.router(await AdminCatalogOptionRouter(fastify)),
        optionGroups: t.router(await AdminCatalogOptionGroupsRouter(fastify)),
        product: t.router(await AdminCatalogProductRouter(fastify)),
        productVariant: t.router(
          await AdminCatalogProductVariantRouter(fastify),
        ),
      }),
      files: t.router(await AdminFilesRouter(fastify)),
      language: t.router(await AdminLanguageRouter(fastify)),
      orders: t.router(await AdminOrdersRouter(fastify)),
      vendor: t.router(await AdminVendorRouter(fastify)),
    }),
    web: t.router({
      catalog: t.router({
        category: t.router(await WebCatalogCategoryRouter(fastify)),
        post: t.router(await WebCatalogPostRouter(fastify)),
        product: t.router(await WebCatalogProductRouter(fastify)),
      }),
      languages: t.router(await WebLanguagesRouter(fastify)),
      order: t.router(await WebOrderRouter(fastify)),
    }),
  });
}

export type AppRouter = Awaited<ReturnType<typeof createAppRouter>>;
