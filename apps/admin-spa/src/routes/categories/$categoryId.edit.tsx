import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CategoryForm } from "../../components/forms/category-form";
import { toast } from "sonner";
import { trpc } from "../../utils/trpc";

export const Route = createFileRoute("/categories/$categoryId/edit")({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "Edit Category",
  }),
  loader: async ({ context, params }) => {
    console.log({ params });
    const languages = await context.trpc.admin.language.list.fetch();
    const category =
      await context.trpc.admin.catalog.category.findCategoryById.fetch({
        id: Number(params.categoryId),
      });
    if (!category) {
      throw new Error("Category not found");
    }

    return { languages, category };
  },
  component: CategoryComponent,
});

function CategoryComponent() {
  const { languages, category } = Route.useLoaderData();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const mutation = trpc.admin.catalog.category.updateCategory.useMutation({
    onSuccess: async () => {
      await utils.admin.catalog.category.listCategories.invalidate();
      toast.success("Category updated");
      navigate({ to: "/categories" });
    },
  });

  return (
    <div className="container mx-auto py-10">
      <CategoryForm
        languages={languages}
        edit
        onSubmit={async (data) => {
          mutation.mutate({
            id: category.id,
            imageId: data.imageId,
            descriptions: data.descriptions?.map((d) => ({
              name: d.name,
              languageId: d.languageId,
            })),
          });
        }}
        values={category}
        errorMessage={mutation.error?.message}
      />
    </div>
  );
}
