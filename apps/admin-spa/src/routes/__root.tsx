import {
  createRootRoute,
  Outlet,
  useMatches,
  useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Layout } from "../components/layout";
import { useEffect } from "react";

declare module "@tanstack/react-router" {
  interface RouteContext {
    getTitle?: () => string | Promise<string>;
  }
}

function Root() {
  const matches = useMatches();

  useEffect(() => {
    // Set document title based on lowest matching route with a title
    const breadcrumbPromises = [...matches]
      .reverse()
      .map((match, index) => {
        if (!("getTitle" in match.routeContext)) {
          if (index === 0 && import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.warn("no getTitle", match.pathname, match);
          }
          return undefined;
        }
        const { routeContext } = match;
        return routeContext.getTitle?.();
      })
      .filter(Boolean);

    void Promise.all(breadcrumbPromises).then((titles) => {
      document.title = titles.join(" · ");
      return titles;
    });
  }, [matches]);

  return (
    <>
      <Layout>
        <Outlet />
        <TanStackRouterDevtools />
      </Layout>
    </>
  );
}
export const Route = createRootRoute({
  component: Root,
});
