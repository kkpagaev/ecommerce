import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
} from "@clerk/clerk-react";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Layout } from "../components/layout";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </header>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Layout>
        <Outlet />
        <TanStackRouterDevtools />
      </Layout>
    </>
  ),
});
