import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import {
  Link,
  Outlet,
  createRootRouteWithContext,
  redirect,
} from '@tanstack/react-router'
import { RouterContext } from '../routerContext'
import { Context } from '@tanstack/react-cross-context'
import { useRouter } from '@tanstack/react-router'
import jsesc from 'jsesc'
import * as React from 'react'
import { trpcClient } from '../utils/trpc'

export function DehydrateRouter() {
  const router = useRouter()

  const dehydratedCtx = React.useContext(
    Context.get('TanStackRouterHydrationContext', {}),
  )

  const dehydrated = router.dehydratedData || dehydratedCtx

  // Use jsesc to escape the stringified JSON for use in a script tag
  const stringified = jsesc(router.options.transformer.stringify(dehydrated), {
    isScriptContext: true,
    wrap: true,
  })

  return (
    <script
      id="__TSR_DEHYDRATED__"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
          window.__TSR_DEHYDRATED__ = {
            data: ${stringified}
          }
        `,
      }}
    />
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  beforeLoad: async ({ params })  =>{
    const language = (params as { ln?: string }).ln
    const languages = await trpcClient.web.languages.listLanguages.query();

    const locale = languages.find(l => l.name === language)

    if (!language || !locale) {
      throw redirect({
        to: '/$ln',
        params: {
          ln: languages[0].name
        }
      })
    }

    return {
      languages,
      locale: locale
    }
  },
  loader: async ({ context }) => {
    const categories = await trpcClient.web.catalog.category.listCategoriesForHeader.query({
      languageId: context.locale.id
    })

    return {
      locale: context.locale,
      categories
    }
  }
})

function RootComponent() {
  const { locale } = Route.useLoaderData()

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite App</title>
        <script src="https://cdn.tailwindcss.com" />
        <script
          type="module"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              import RefreshRuntime from "/@react-refresh"
              RefreshRuntime.injectIntoGlobalHook(window)
              window.$RefreshReg$ = () => {}
              window.$RefreshSig$ = () => (type) => type
              window.__vite_plugin_react_preamble_installed__ = true
            `,
          }}
        />
        <script type="module" src="/@vite/client" />
        <script type="module" src="/src/entry-client.tsx" />
      </head>
      <body>
        <div className="p-2 flex gap-2 text-lg">
          <Link
            to="/$ln"
            activeProps={{
              className: 'font-bold',
            }}
            params={{
                ln: locale.name,
            }}
          >
            Home
          </Link>
          <Link
            to="/$ln/posts"
            params={{
              ln: locale.name,
            }}
            activeProps={{
              className: 'font-bold',
            }}
          >
            Posts
          </Link>
          <Link
            to="/$ln/error"
            params={{
              ln: locale.name,
            }}
            activeProps={{
              className: 'font-bold',
            }}
          >
            Error
          </Link>
        </div>
        <hr />
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
        <DehydrateRouter />
      </body>
    </html>
  )
}
