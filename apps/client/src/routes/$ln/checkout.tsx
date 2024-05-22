import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$ln/checkout")({
  component: () => <div>Hello /$ln/checkout!</div>,
});
