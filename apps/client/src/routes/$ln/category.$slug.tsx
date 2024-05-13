import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$ln/category/$slug")({
  loader: async ({ params }) => {
    return params.slug;
  },
  component: () => <div>Category</div>,
});

function CategoryComponent() {
  return <div>Category</div>;
}
