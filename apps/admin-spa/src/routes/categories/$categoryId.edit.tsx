import { createFileRoute } from "@tanstack/react-router";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";

export const Route = createFileRoute("/categories/$categoryId/edit")({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "Category",
  }),
  loader: async ({ context, params }) => {
    const category =
      await context.trpc.admin.catalog.category.findCategoryById.fetch({
        id: Number(params.categoryId),
      });
    if (!category) {
      throw new Error("Category not found");
    }
    return { category };
  },
  component: CategoryComponent,
});

function CategoryComponent() {
  const { category } = Route.useLoaderData();

  return (
    <div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <Input id="picture" type="file" />
      </div>
      {category.descriptions.map((description) => (
        <p>
          {description.name}: {description.language_name}
        </p>
      ))}
    </div>
  );
}
