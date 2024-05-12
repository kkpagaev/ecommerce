import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { RouterContext } from '../routerContext'
import { Context } from '@tanstack/react-cross-context'
import { useRouter } from '@tanstack/react-router'
import jsesc from 'jsesc'
import * as React from 'react'

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
})

function RootComponent() {
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
                ln: 'uk',
            }}
          >
            Home
          </Link>
          <Link
            to="/$ln/posts"
            params={{
                ln: 'uk',
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
                ln: 'uk',
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
