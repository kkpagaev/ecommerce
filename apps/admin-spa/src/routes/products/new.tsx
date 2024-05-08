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
    const attributes = await context.trpc.admin.catalog.attribute.listAll
      .fetch({
        languageId: 1,
      })
      .then((ats) => {
        return ats.map((a) => ({
          id: a.id,
          name: a.group_name + " - " + a.name,
        }));
      });

    const categories = await context.trpc.admin.catalog.category.listCategories
      .fetch({
        languageId: 1,
      })
      .then(({ data }) => data);

    return { languages, categories, attributes };
  },
  component: ProductNewComponent,
});

function ProductNewComponent() {
  const { languages, categories, attributes } = Route.useLoaderData();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const mutation = trpc.admin.catalog.product.createProduct.useMutation({
    onSuccess: async () => {
      await utils.admin.catalog.product.listProducts.invalidate();
      toast.success("Product created");
      navigate({ to: "/products" });
    },
  });

  return (
    <div className="container mx-auto py-10">
      <ProductForm
        attributes={attributes}
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
