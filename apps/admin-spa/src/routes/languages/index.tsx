import { createFileRoute } from "@tanstack/react-router";
import { api, trpc } from "../../utils/trpc";

export const Route = createFileRoute("/languages/")({
  loader: () => {
    return api.admin.language.list.query();
  },
  component: Index,
});

function Index() {
  const data = Route.useLoaderData();

  return (
    <div className="container mx-auto py-10">
      {data.map((lang) => (
        <div key={lang.id}>{lang.name}</div>
      ))}
    </div>
  );
}
