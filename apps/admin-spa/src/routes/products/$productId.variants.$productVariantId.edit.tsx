import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { trpc } from "../../utils/trpc";
import { toast } from "sonner";
import { ProductVariantForm } from "../../components/forms/product-variant-form";

export const Route = createFileRoute(
  "/products/$productId/variants/$productVariantId/edit",
)({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "New Product Variant Group",
  }),
  loader: async ({ context, params }) => {
    const variant =
      await context.trpc.admin.catalog.productVariant.findProductVariant.fetch({
        id: Number(params.productVariantId),
        languageId: 1,
      });
    if (!variant) {
      throw new Error("Product variant not found");
    }
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
    const filteredOptionGroups = optionGroups.filter((o) =>
      product.options.includes(o.id),
    );

    return { optionGroups: filteredOptionGroups, variant };
  },
  component: ProductNewComponent,
});

function ProductNewComponent() {
  const { optionGroups, variant } = Route.useLoaderData();
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const router = useRouter();
  const params = Route.useParams();

  const mutation =
    trpc.admin.catalog.productVariant.updateProductVariant.useMutation({
      onSuccess: async () => {
        router.invalidate();
        await utils.admin.catalog.productVariant.listProductVariants.invalidate();
        toast.success("Product variant updated");
        navigate({
          to: "/products/$productId/variants",
          params: { productId: params.productId },
        });
      },
    });

  return (
    <div>
      <ProductVariantForm
        edit
        optionGroups={optionGroups}
        values={variant}
        onSubmit={async (data) => {
          console.log(data);
          mutation.mutate({
            id: variant.id,
            ...data,
          });
        }}
        errorMessage={mutation.error?.message}
      />
    </div>
  );
}
