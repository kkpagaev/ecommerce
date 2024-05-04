import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/categories/$categoryId")({
  beforeLoad: () => ({ getTitle: () => "Category" }),
  component: CategoryComponent,
});

function CategoryComponent() {
  const id = Route.useParams();

  return <div>{id.categoryId}</div>;
}
