import "./index.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import TrpcProvider from "./providers/trpc";
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

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TrpcProvider>
        <RouterProvider router={router} />
      </TrpcProvider>
    </StrictMode>,
  );
}
