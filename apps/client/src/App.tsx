import { AnyRouter, RouterProvider, useRouter } from "@tanstack/react-router";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import TrpcProvider from "./providers/trpc";
import { createRouter } from "./router";

const PUBLISHABLE_KEY = "pk_test_Zm9uZC1tdWxlLTg3LmNsZXJrLmFjY291bnRzLmRldiQ";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function InnerApp({ router }: { router: AnyRouter }) {
  return (
    <RouterProvider
      router={router}
      context={{
        head: "",
      }}
    />
  )
}
export function App({ router }: { router: ReturnType<typeof createRouter>}) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <TrpcProvider>
        <InnerApp router={router} />
      </TrpcProvider>
    </ClerkProvider>
  );
}
