import "./index.css";
import { ReactNode, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import TrpcProvider from "./providers/trpc";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
// import { trpc } from "./utils/trpc";

export const router = createRouter({
  routeTree,
  context: {
    user: {
      id: "123",
      name: "John Doe",
    },
  },
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
    return <div className="container mx-auto py-10">...loading</div>;
  }
  return <>{children}</>;
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <Auth>
          <TrpcProvider>
            <RouterProvider router={router} />
          </TrpcProvider>
        </Auth>
      </ClerkProvider>
    </StrictMode>,
  );
}
