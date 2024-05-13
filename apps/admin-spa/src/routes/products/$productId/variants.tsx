import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import type { AdminOutputs } from "@/utils/trpc";
import { z } from "zod";
import { SearchFilters } from "@/components/search-filters";

export const Route = createFileRoute("/products/$productId/variants")({
  component: Index,
  beforeLoad: async ({ context }) => {
    return {
      ...context,
      getTitle: () => "Product variants",
    };
  },
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
  loader: async ({ context, deps, params }) => {
    const product =
      await context.trpc.admin.catalog.product.findOneProduct.fetch({
        id: Number(params.productId),
      });
    if (!product) {
      throw new Error("Product not found");
    }
    const productVariants =
      await context.trpc.admin.catalog.productVariant.listProductVariants.fetch(
        {
          productId: product.id,
          languageId: deps.languageId,
        },
      );
    return { product, productVariants };
  },
});

function Index() {
  const { product } = Route.useLoaderData();
  const search = Route.useSearch();

  return (
    <div>
      <h2>
        {search.languageId
          ? product.descriptions.find(
              (d) => d.language_id === search.languageId,
            )?.name
          : product.descriptions[0].name}
      </h2>
      <div className="w-full flex flex-row gap-10">
        <SearchFilters
          search={search}
          fullPath={Route.fullPath}
          filters={[
            {
              name: "languageId",
              type: "languageId",
            },
          ]}
        />
        <div className="flex flex-col gap-2">
          <Link
            to={"/products/$productId/variants/new"}
            params={{ productId: "" + product.id }}
            className="w-full"
          >
            <Button variant="default">New Variant</Button>
          </Link>
          <Link
            to={"/products/$productId/variants/"}
            params={{ productId: "" + product.id }}
            className="w-full"
          >
            <Button variant="default">List Variant</Button>
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
