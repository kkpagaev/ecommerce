import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => ({ getTitle: () => "Dashboard" }),
  component: Index,
});
function Index() {
  return <div className="container mx-auto py-10">Dashboard</div>;
}
