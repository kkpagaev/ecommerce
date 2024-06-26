import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { ProductVariantForm } from "@/components/forms/product-variant-form";

export const Route = createFileRoute("/products/$productId/variants/new")({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "New Product Variant Group",
  }),
  loader: async ({ context, params }) => {
    const languages = await context.trpc.admin.language.list.fetch();
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
    console.log(optionGroups);
    const filteredOptionGroups = optionGroups.filter((optionGroup) =>
      product.optionGroups.includes(optionGroup.id),
    );

    return { optionGroups: filteredOptionGroups, languages };
  },
  component: ProductNewComponent,
});

function ProductNewComponent() {
  const { optionGroups, languages } = Route.useLoaderData();
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const router = useRouter();
  const params = Route.useParams();

  const mutation =
    trpc.admin.catalog.productVariant.createProductVariant.useMutation({
      onSuccess: async () => {
        router.invalidate();
        await utils.admin.catalog.productVariant.listProductVariants.invalidate();
        toast.success("Product variant created");
        navigate({
          to: "/products/$productId/variants",
          params: { productId: params.productId },
        });
      },
    });

  return (
    <div>
      <ProductVariantForm
        languages={languages}
        optionGroups={optionGroups}
        onSubmit={async (data) => {
          mutation.mutate({
            productId: Number(params.productId),
            ...data,
          });
        }}
        errorMessage={mutation.error?.message}
      />
    </div>
  );
}
