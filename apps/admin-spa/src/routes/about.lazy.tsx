import { useAuth } from "@clerk/clerk-react";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  const { getToken } = useAuth();

  getToken().then(async (r) => {
    const res = await fetch("http://localhost:3000/clerk", {
      headers: {
        Authorization: `Bearer ${r}`,
      },
    });

    console.log(await res.json());
  });

  return <div className="p-2">Hello from About!</div>;
}
