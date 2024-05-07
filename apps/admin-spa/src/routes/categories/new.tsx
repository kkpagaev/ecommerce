import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { trpc } from "../../utils/trpc";
import { toast } from "sonner";
import { CategoryForm } from "../../components/forms/category-form";

export const Route = createFileRoute("/categories/new")({
  beforeLoad: ({ context }) => ({ ...context, getTitle: () => "New Category" }),
  loader: async ({ context }) => {
    const languages = await context.trpc.admin.language.list.fetch();

    return { languages };
  },
  component: CategoryNewComponent,
});

function CategoryNewComponent() {
  const { languages } = Route.useLoaderData();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const mutation = trpc.admin.catalog.category.createCategory.useMutation({
    onSuccess: async () => {
      await utils.admin.catalog.category.listCategories.invalidate();
      toast.success("Category created");
      navigate({ to: "/categories" });
    },
  });

  return (
    <CategoryForm
      languages={languages}
      onSubmit={async (data) => {
        mutation.mutate(data);
      }}
      errorMessage={mutation.error?.message}
    />
  );
}
