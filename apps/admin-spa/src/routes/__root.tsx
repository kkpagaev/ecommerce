import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Layout } from "../components/layout";

declare module "@tanstack/react-router" {
  interface RouteContext {
    getTitle?: () => string;
  }
}

function Root() {
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
