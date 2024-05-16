import "./index.css";
import { ReactNode, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import TrpcProvider from "./providers/trpc";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { trpc } from "./utils/trpc";
// import { trpc } from "./utils/trpc";

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const rootElement = document.getElementById("root")!;

function Auth({ children }: { children: ReactNode }) {
  const { isLoaded } = useAuth();
  if (isLoaded === false) {
    return <div>...loading</div>;
  }
  return <>{children}</>;
}

function InnerApp() {
  const t = trpc.useUtils();

  return (
    <RouterProvider
      router={router}
      context={{
        trpc: t,
      }}
    />
  );
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <Auth>
          <TrpcProvider>
            <InnerApp />
          </TrpcProvider>
        </Auth>
      </ClerkProvider>
    </StrictMode>,
  );
}
