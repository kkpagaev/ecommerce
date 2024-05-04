// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'
import { Route as LanguagesIndexImport } from './routes/languages/index'
import { Route as CategoriesIndexImport } from './routes/categories/index'

// Create/Update Routes

const AboutRoute = AboutImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const LanguagesIndexRoute = LanguagesIndexImport.update({
  path: '/languages/',
  getParentRoute: () => rootRoute,
} as any)

const CategoriesIndexRoute = CategoriesIndexImport.update({
  path: '/categories/',
  getParentRoute: () => rootRoute,
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
    '/categories/': {
      preLoaderRoute: typeof CategoriesIndexImport
      parentRoute: typeof rootRoute
    }
    '/languages/': {
      preLoaderRoute: typeof LanguagesIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  AboutRoute,
  CategoriesIndexRoute,
  LanguagesIndexRoute,
])
