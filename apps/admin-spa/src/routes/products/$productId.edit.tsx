import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CategoryForm } from "../../components/forms/category-form";
import { toast } from "sonner";
import { trpc } from "../../utils/trpc";
import { ProductForm } from "../../components/forms/product-form";

export const Route = createFileRoute("/products/$productId/edit")({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "Edit Category",
  }),
  loader: async ({ context, params }) => {
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
    const languages = await context.trpc.admin.language.list.fetch();

    const product =
      await context.trpc.admin.catalog.product.findOneProduct.fetch({
        id: Number(params.productId),
      });
    console.log(product);
    if (!product) {
      throw new Error("Product not found");
    }

    return { languages, categories, attributes, product };
  },
  component: CategoryComponent,
});

function CategoryComponent() {
  const { languages, product, attributes, categories } = Route.useLoaderData();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const mutation = trpc.admin.catalog.product.updateProduct.useMutation({
    onSuccess: async () => {
      await utils.admin.catalog.product.listProducts.invalidate();
      await utils.admin.catalog.product.findOneProduct.invalidate({
        id: product.id,
      });
      toast.success("Product updated");
      navigate({ to: "/products" });
    },
  });

  return (
    <div className="container mx-auto py-10">
      <ProductForm
        edit
        languages={languages}
        attributes={attributes}
        categories={categories}
        values={product}
        onSubmit={async (data) => {
          mutation.mutate({
            ...data,
            id: product.id,
          });
        }}
        errorMessage={mutation.error?.message}
      />
    </div>
  );
}
