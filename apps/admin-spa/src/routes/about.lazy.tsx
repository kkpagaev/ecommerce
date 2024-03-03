import { createLazyFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  const router = useRouter();

  return <div className="p-2">Hello from About!</div>;
}
