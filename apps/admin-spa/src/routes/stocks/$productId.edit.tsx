import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";
import { z } from "zod";
import { StockUpsertForm } from "../../components/forms/stock-upsert-form";

export const Route = createFileRoute("/stocks/$productId/edit")({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "Edit Product Stock",
  }),
  validateSearch: (search: Record<string, unknown>) => {
    return z
      .object({
        languageId: z.number().optional(),
      })
      .parse(search);
  },
  loaderDeps: ({ search }) => ({
    languageId: search.languageId || 1,
  }),
  loader: async ({ context, params, deps, navigate }) => {
    const product =
      await context.trpc.admin.catalog.product.findOneProduct.fetch({
        id: Number(params.productId),
      });
    if (!product) {
      throw new Error("Product not found");
    }
    const productVariantsStocks =
      await context.trpc.admin.inventory.stocks.getProductVariantStocks.fetch({
        productId: product.id,
        languageId: deps.languageId,
      });
    if (productVariantsStocks.length === 0) {
      navigate({ to: "/stocks" });
      return;
    }

    const locations =
      await context.trpc.admin.inventory.location.listLocations.fetch({});

    const productVariantIds = productVariantsStocks.map(
      (s) => s.product_variant_id,
    );
    const productVariationOptions =
      await context.trpc.admin.catalog.productVariant.listProductVariantsOptions.fetch(
        {
          languageId: deps.languageId,
          productVariantIds: productVariantIds,
        },
      );

    const productVariations = productVariantsStocks.map((s) => ({
      id: s.product_variant_id,
      count: s.count,
      locationId: s.location_id,
      options: productVariationOptions
        .filter((o) => o.product_variant_id === s.product_variant_id)
        .map((o) => ({ id: o.option_id, name: o.name })),
    }));

    return {
      productVariations,
      locations: locations.reduce(
        (map, l) => map.set(l.id, l.name),
        new Map<number, string>(),
      ),
      options: productVariationOptions.reduce(
        (map, o) => map.set(o.option_id, o.name),
        new Map<number, string>(),
      ),
    };
  },
  component: CategoryComponent,
});

function CategoryComponent() {
  const { productVariations, locations, options } = Route.useLoaderData();
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const router = useRouter();

  const mutation = trpc.admin.inventory.stocks.upsertStock.useMutation({
    onSuccess: async () => {
      router.invalidate();
      await utils.admin.catalog.product.listProducts.invalidate();
      toast.success("Product updated");
      navigate({ to: "/products" });
    },
  });

  return (
    <div className="container mx-auto py-10">
      <StockUpsertForm
        values={{
          options: options,
          locations: locations,
          productVariations: productVariations,
        }}
        onSubmit={async (data) => {
          mutation.mutate(
            data.map((d) => ({
              count: d.count,
              locationId: d.locationId,
              productVariantId: d.productVariantId,
            })),
          );
        }}
        errorMessage={mutation.error?.message}
      />
    </div>
  );
}
