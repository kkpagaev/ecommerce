import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$ln/thankyou")({
  component: () => <div>Thank you for your order</div>,
});
