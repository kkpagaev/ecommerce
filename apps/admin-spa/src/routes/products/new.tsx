import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { trpc } from "../../utils/trpc";
import { toast } from "sonner";
import { ProductForm } from "../../components/forms/product-form";

export const Route = createFileRoute("/products/new")({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "New Attribute Group",
  }),
  loader: async ({ context }) => {
    const languages = await context.trpc.admin.language.list.fetch();
    const categories = await context.trpc.admin.catalog.category.listCategories
      .fetch({
        languageId: 1,
      })
      .then(({ data }) => data);

    return { languages, categories };
  },
  component: ProductNewComponent,
});

function ProductNewComponent() {
  const { languages, categories } = Route.useLoaderData();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const mutation = trpc.admin.catalog.product.createProduct.useMutation({
    onSuccess: async () => {
      await utils.admin.catalog.category.listCategories.invalidate();
      toast.success("Attribute Group created");
      navigate({ to: "/attribute-groups" });
    },
  });

  return (
    <div className="container mx-auto py-10">
      <ProductForm
        categories={categories}
        languages={languages}
        onSubmit={async (data) => {
          mutation.mutate(data);
        }}
        errorMessage={mutation.error?.message}
      />
    </div>
  );
}
