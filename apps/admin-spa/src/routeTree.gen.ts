// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as StocksImport } from './routes/stocks'
import { Route as LocationsImport } from './routes/locations'
import { Route as LanguagesImport } from './routes/languages'
import { Route as CategoriesImport } from './routes/categories'
import { Route as AdminsImport } from './routes/admins'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'
import { Route as ProductsIndexImport } from './routes/products/index'
import { Route as OptionGroupsIndexImport } from './routes/option-groups/index'
import { Route as AttributeGroupsIndexImport } from './routes/attribute-groups/index'
import { Route as ProductsNewImport } from './routes/products/new'
import { Route as OptionGroupsNewImport } from './routes/option-groups/new'
import { Route as OptionGroupsOptionGroupIdImport } from './routes/option-groups/$optionGroupId'
import { Route as LocationsNewImport } from './routes/locations/new'
import { Route as LanguagesNewImport } from './routes/languages/new'
import { Route as CategoriesNewImport } from './routes/categories/new'
import { Route as AttributeGroupsNewImport } from './routes/attribute-groups/new'
import { Route as AttributeGroupsAttributeGroupIdImport } from './routes/attribute-groups/$attributeGroupId'
import { Route as AdminsNewImport } from './routes/admins/new'
import { Route as StocksProductIdEditImport } from './routes/stocks/$productId.edit'
import { Route as ProductsProductIdVariantsImport } from './routes/products/$productId.variants'
import { Route as ProductsProductIdEditImport } from './routes/products/$productId.edit'
import { Route as OptionGroupsOptionGroupIdEditImport } from './routes/option-groups/$optionGroupId.edit'
import { Route as LocationsLocationIdEditImport } from './routes/locations/$locationId.edit'
import { Route as LanguagesLanguageIdEditImport } from './routes/languages/$languageId.edit'
import { Route as CategoriesCategoryIdEditImport } from './routes/categories/$categoryId.edit'
import { Route as AttributeGroupsAttributeGroupIdEditImport } from './routes/attribute-groups/$attributeGroupId.edit'
import { Route as AdminsAdminIdEditImport } from './routes/admins/$adminId.edit'
import { Route as ProductsProductIdVariantsNewImport } from './routes/products/$productId.variants.new'
import { Route as OptionGroupsOptionGroupIdOptionNewImport } from './routes/option-groups/$optionGroupId.option.new'
import { Route as AttributeGroupsAttributeGroupIdAttributeNewImport } from './routes/attribute-groups/$attributeGroupId.attribute.new'
import { Route as ProductsProductIdVariantsProductVariantIdEditImport } from './routes/products/$productId.variants.$productVariantId.edit'
import { Route as OptionGroupsOptionGroupIdOptionOptionIdEditImport } from './routes/option-groups/$optionGroupId.option.$optionId.edit'
import { Route as AttributeGroupsAttributeGroupIdAttributeAttributeIdEditImport } from './routes/attribute-groups/$attributeGroupId.attribute.$attributeId.edit'

// Create/Update Routes

const StocksRoute = StocksImport.update({
  path: '/stocks',
  getParentRoute: () => rootRoute,
} as any)

const LocationsRoute = LocationsImport.update({
  path: '/locations',
  getParentRoute: () => rootRoute,
} as any)

const LanguagesRoute = LanguagesImport.update({
  path: '/languages',
  getParentRoute: () => rootRoute,
} as any)

const CategoriesRoute = CategoriesImport.update({
  path: '/categories',
  getParentRoute: () => rootRoute,
} as any)

const AdminsRoute = AdminsImport.update({
  path: '/admins',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const ProductsIndexRoute = ProductsIndexImport.update({
  path: '/products/',
  getParentRoute: () => rootRoute,
} as any)

const OptionGroupsIndexRoute = OptionGroupsIndexImport.update({
  path: '/option-groups/',
  getParentRoute: () => rootRoute,
} as any)

const AttributeGroupsIndexRoute = AttributeGroupsIndexImport.update({
  path: '/attribute-groups/',
  getParentRoute: () => rootRoute,
} as any)

const ProductsNewRoute = ProductsNewImport.update({
  path: '/products/new',
  getParentRoute: () => rootRoute,
} as any)

const OptionGroupsNewRoute = OptionGroupsNewImport.update({
  path: '/option-groups/new',
  getParentRoute: () => rootRoute,
} as any)

const OptionGroupsOptionGroupIdRoute = OptionGroupsOptionGroupIdImport.update({
  path: '/option-groups/$optionGroupId',
  getParentRoute: () => rootRoute,
} as any)

const LocationsNewRoute = LocationsNewImport.update({
  path: '/new',
  getParentRoute: () => LocationsRoute,
} as any)

const LanguagesNewRoute = LanguagesNewImport.update({
  path: '/new',
  getParentRoute: () => LanguagesRoute,
} as any)

const CategoriesNewRoute = CategoriesNewImport.update({
  path: '/new',
  getParentRoute: () => CategoriesRoute,
} as any)

const AttributeGroupsNewRoute = AttributeGroupsNewImport.update({
  path: '/attribute-groups/new',
  getParentRoute: () => rootRoute,
} as any)

const AttributeGroupsAttributeGroupIdRoute =
  AttributeGroupsAttributeGroupIdImport.update({
    path: '/attribute-groups/$attributeGroupId',
    getParentRoute: () => rootRoute,
  } as any)

const AdminsNewRoute = AdminsNewImport.update({
  path: '/new',
  getParentRoute: () => AdminsRoute,
} as any)

const StocksProductIdEditRoute = StocksProductIdEditImport.update({
  path: '/$productId/edit',
  getParentRoute: () => StocksRoute,
} as any)

const ProductsProductIdVariantsRoute = ProductsProductIdVariantsImport.update({
  path: '/products/$productId/variants',
  getParentRoute: () => rootRoute,
} as any)

const ProductsProductIdEditRoute = ProductsProductIdEditImport.update({
  path: '/products/$productId/edit',
  getParentRoute: () => rootRoute,
} as any)

const OptionGroupsOptionGroupIdEditRoute =
  OptionGroupsOptionGroupIdEditImport.update({
    path: '/edit',
    getParentRoute: () => OptionGroupsOptionGroupIdRoute,
  } as any)

const LocationsLocationIdEditRoute = LocationsLocationIdEditImport.update({
  path: '/$locationId/edit',
  getParentRoute: () => LocationsRoute,
} as any)

const LanguagesLanguageIdEditRoute = LanguagesLanguageIdEditImport.update({
  path: '/$languageId/edit',
  getParentRoute: () => LanguagesRoute,
} as any)

const CategoriesCategoryIdEditRoute = CategoriesCategoryIdEditImport.update({
  path: '/$categoryId/edit',
  getParentRoute: () => CategoriesRoute,
} as any)

const AttributeGroupsAttributeGroupIdEditRoute =
  AttributeGroupsAttributeGroupIdEditImport.update({
    path: '/edit',
    getParentRoute: () => AttributeGroupsAttributeGroupIdRoute,
  } as any)

const AdminsAdminIdEditRoute = AdminsAdminIdEditImport.update({
  path: '/$adminId/edit',
  getParentRoute: () => AdminsRoute,
} as any)

const ProductsProductIdVariantsNewRoute =
  ProductsProductIdVariantsNewImport.update({
    path: '/new',
    getParentRoute: () => ProductsProductIdVariantsRoute,
  } as any)

const OptionGroupsOptionGroupIdOptionNewRoute =
  OptionGroupsOptionGroupIdOptionNewImport.update({
    path: '/option/new',
    getParentRoute: () => OptionGroupsOptionGroupIdRoute,
  } as any)

const AttributeGroupsAttributeGroupIdAttributeNewRoute =
  AttributeGroupsAttributeGroupIdAttributeNewImport.update({
    path: '/attribute/new',
    getParentRoute: () => AttributeGroupsAttributeGroupIdRoute,
  } as any)

const ProductsProductIdVariantsProductVariantIdEditRoute =
  ProductsProductIdVariantsProductVariantIdEditImport.update({
    path: '/$productVariantId/edit',
    getParentRoute: () => ProductsProductIdVariantsRoute,
  } as any)

const OptionGroupsOptionGroupIdOptionOptionIdEditRoute =
  OptionGroupsOptionGroupIdOptionOptionIdEditImport.update({
    path: '/option/$optionId/edit',
    getParentRoute: () => OptionGroupsOptionGroupIdRoute,
  } as any)

const AttributeGroupsAttributeGroupIdAttributeAttributeIdEditRoute =
  AttributeGroupsAttributeGroupIdAttributeAttributeIdEditImport.update({
    path: '/attribute/$attributeId/edit',
    getParentRoute: () => AttributeGroupsAttributeGroupIdRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/admins': {
      preLoaderRoute: typeof AdminsImport
      parentRoute: typeof rootRoute
    }
    '/categories': {
      preLoaderRoute: typeof CategoriesImport
      parentRoute: typeof rootRoute
    }
    '/languages': {
      preLoaderRoute: typeof LanguagesImport
      parentRoute: typeof rootRoute
    }
    '/locations': {
      preLoaderRoute: typeof LocationsImport
      parentRoute: typeof rootRoute
    }
    '/stocks': {
      preLoaderRoute: typeof StocksImport
      parentRoute: typeof rootRoute
    }
    '/admins/new': {
      preLoaderRoute: typeof AdminsNewImport
      parentRoute: typeof AdminsImport
    }
    '/attribute-groups/$attributeGroupId': {
      preLoaderRoute: typeof AttributeGroupsAttributeGroupIdImport
      parentRoute: typeof rootRoute
    }
    '/attribute-groups/new': {
      preLoaderRoute: typeof AttributeGroupsNewImport
      parentRoute: typeof rootRoute
    }
    '/categories/new': {
      preLoaderRoute: typeof CategoriesNewImport
      parentRoute: typeof CategoriesImport
    }
    '/languages/new': {
      preLoaderRoute: typeof LanguagesNewImport
      parentRoute: typeof LanguagesImport
    }
    '/locations/new': {
      preLoaderRoute: typeof LocationsNewImport
      parentRoute: typeof LocationsImport
    }
    '/option-groups/$optionGroupId': {
      preLoaderRoute: typeof OptionGroupsOptionGroupIdImport
      parentRoute: typeof rootRoute
    }
    '/option-groups/new': {
      preLoaderRoute: typeof OptionGroupsNewImport
      parentRoute: typeof rootRoute
    }
    '/products/new': {
      preLoaderRoute: typeof ProductsNewImport
      parentRoute: typeof rootRoute
    }
    '/attribute-groups/': {
      preLoaderRoute: typeof AttributeGroupsIndexImport
      parentRoute: typeof rootRoute
    }
    '/option-groups/': {
      preLoaderRoute: typeof OptionGroupsIndexImport
      parentRoute: typeof rootRoute
    }
    '/products/': {
      preLoaderRoute: typeof ProductsIndexImport
      parentRoute: typeof rootRoute
    }
    '/admins/$adminId/edit': {
      preLoaderRoute: typeof AdminsAdminIdEditImport
      parentRoute: typeof AdminsImport
    }
    '/attribute-groups/$attributeGroupId/edit': {
      preLoaderRoute: typeof AttributeGroupsAttributeGroupIdEditImport
      parentRoute: typeof AttributeGroupsAttributeGroupIdImport
    }
    '/categories/$categoryId/edit': {
      preLoaderRoute: typeof CategoriesCategoryIdEditImport
      parentRoute: typeof CategoriesImport
    }
    '/languages/$languageId/edit': {
      preLoaderRoute: typeof LanguagesLanguageIdEditImport
      parentRoute: typeof LanguagesImport
    }
    '/locations/$locationId/edit': {
      preLoaderRoute: typeof LocationsLocationIdEditImport
      parentRoute: typeof LocationsImport
    }
    '/option-groups/$optionGroupId/edit': {
      preLoaderRoute: typeof OptionGroupsOptionGroupIdEditImport
      parentRoute: typeof OptionGroupsOptionGroupIdImport
    }
    '/products/$productId/edit': {
      preLoaderRoute: typeof ProductsProductIdEditImport
      parentRoute: typeof rootRoute
    }
    '/products/$productId/variants': {
      preLoaderRoute: typeof ProductsProductIdVariantsImport
      parentRoute: typeof rootRoute
    }
    '/stocks/$productId/edit': {
      preLoaderRoute: typeof StocksProductIdEditImport
      parentRoute: typeof StocksImport
    }
    '/attribute-groups/$attributeGroupId/attribute/new': {
      preLoaderRoute: typeof AttributeGroupsAttributeGroupIdAttributeNewImport
      parentRoute: typeof AttributeGroupsAttributeGroupIdImport
    }
    '/option-groups/$optionGroupId/option/new': {
      preLoaderRoute: typeof OptionGroupsOptionGroupIdOptionNewImport
      parentRoute: typeof OptionGroupsOptionGroupIdImport
    }
    '/products/$productId/variants/new': {
      preLoaderRoute: typeof ProductsProductIdVariantsNewImport
      parentRoute: typeof ProductsProductIdVariantsImport
    }
    '/attribute-groups/$attributeGroupId/attribute/$attributeId/edit': {
      preLoaderRoute: typeof AttributeGroupsAttributeGroupIdAttributeAttributeIdEditImport
      parentRoute: typeof AttributeGroupsAttributeGroupIdImport
    }
    '/option-groups/$optionGroupId/option/$optionId/edit': {
      preLoaderRoute: typeof OptionGroupsOptionGroupIdOptionOptionIdEditImport
      parentRoute: typeof OptionGroupsOptionGroupIdImport
    }
    '/products/$productId/variants/$productVariantId/edit': {
      preLoaderRoute: typeof ProductsProductIdVariantsProductVariantIdEditImport
      parentRoute: typeof ProductsProductIdVariantsImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  AboutRoute,
  AdminsRoute.addChildren([AdminsNewRoute, AdminsAdminIdEditRoute]),
  CategoriesRoute.addChildren([
    CategoriesNewRoute,
    CategoriesCategoryIdEditRoute,
  ]),
  LanguagesRoute.addChildren([LanguagesNewRoute, LanguagesLanguageIdEditRoute]),
  LocationsRoute.addChildren([LocationsNewRoute, LocationsLocationIdEditRoute]),
  StocksRoute.addChildren([StocksProductIdEditRoute]),
  AttributeGroupsAttributeGroupIdRoute.addChildren([
    AttributeGroupsAttributeGroupIdEditRoute,
    AttributeGroupsAttributeGroupIdAttributeNewRoute,
    AttributeGroupsAttributeGroupIdAttributeAttributeIdEditRoute,
  ]),
  AttributeGroupsNewRoute,
  OptionGroupsOptionGroupIdRoute.addChildren([
    OptionGroupsOptionGroupIdEditRoute,
    OptionGroupsOptionGroupIdOptionNewRoute,
    OptionGroupsOptionGroupIdOptionOptionIdEditRoute,
  ]),
  OptionGroupsNewRoute,
  ProductsNewRoute,
  AttributeGroupsIndexRoute,
  OptionGroupsIndexRoute,
  ProductsIndexRoute,
  ProductsProductIdEditRoute,
  ProductsProductIdVariantsRoute.addChildren([
    ProductsProductIdVariantsNewRoute,
    ProductsProductIdVariantsProductVariantIdEditRoute,
  ]),
])
