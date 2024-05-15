import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";
import { ProductForm } from "@/components/forms/product-form";

export const Route = createFileRoute("/products/$productId/edit")({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "Edit Product",
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
    const categories =
      await context.trpc.admin.catalog.category.listCategories.fetch({
        languageId: 1,
      });
    const languages = await context.trpc.admin.language.list.fetch();

    const vendors = await context.trpc.admin.vendor.list.fetch();
    const product =
      await context.trpc.admin.catalog.product.findOneProduct.fetch({
        id: Number(params.productId),
      });
    if (!product) {
      throw new Error("Product not found");
    }
    const optionGroups =
      await context.trpc.admin.catalog.optionGroups.listOptionGroups.fetch({
        languageId: 1,
      });

    return {
      languages,
      categories,
      attributes,
      product,
      optionGroups,
      vendors,
    };
  },
  component: CategoryComponent,
});

function CategoryComponent() {
  const { languages, product, attributes, categories, optionGroups, vendors } =
    Route.useLoaderData();
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const router = useRouter();

  const mutation = trpc.admin.catalog.product.updateProduct.useMutation({
    onSuccess: async () => {
      router.invalidate();
      await utils.admin.catalog.product.listProducts.invalidate();
      toast.success("Product updated");
      navigate({ to: "/products" });
    },
  });

  return (
    <div>
      <ProductForm
        edit
        vendors={vendors}
        languages={languages}
        attributes={attributes}
        categories={categories}
        optionGroups={optionGroups}
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
