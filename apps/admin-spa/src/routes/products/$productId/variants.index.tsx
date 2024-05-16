import { Link, createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/data-table";

import { Pencil1Icon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { AdminOutputs } from "@/utils/trpc";
import { z } from "zod";
import { SearchFilters } from "@/components/search-filters";
import { TooltipLink } from "@/components/ui/tooltip-link";

type Product = Exclude<
  AdminOutputs["catalog"]["productVariant"]["listProductVariants"][0],
  null
>;

export const Route = createFileRoute("/products/$productId/variants/")({
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
  const { product, productVariants } = Route.useLoaderData();
  const search = Route.useSearch();
  const params = Route.useParams();

  return (
    <div>
      <h2>
        {search.languageId
          ? product.descriptions.find(
              (d) => d.language_id === search.languageId,
            )?.name
          : product.descriptions[0].name}
      </h2>
      <DataTable
        data={
          productVariants
            ? { data: productVariants, count: productVariants.length }
            : undefined
        }
        columns={
          [
            {
              id: "select",
              header: ({ table }) => (
                <Checkbox
                  checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                  }
                  onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                  }
                  aria-label="Select all"
                />
              ),
              cell: ({ row }) => (
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  aria-label="Select row"
                />
              ),
              enableSorting: false,
              enableHiding: false,
            },
            {
              accessorKey: "id",
              enableSorting: true,
              cell: ({ row }) => <div>{row.getValue("id")}</div>,
            },
            {
              accessorKey: "options",
              enableSorting: true,
              cell: ({ row }) => {
                return (
                  <div>
                    {row
                      .getValue<{ name: string }[]>("options")
                      .map((o) => o.name)
                      .join(", ")}
                  </div>
                );
              },
            },
            {
              id: "actions",
              header: "Actions",
              enableHiding: false,
              cell: ({ row }) => {
                return (
                  <TooltipLink
                    to="/products/$productId/variants/$productVariantId/edit"
                    params={{
                      productId: "" + params.productId,
                      productVariantId: "" + row.getValue("id"),
                    }}
                    text="Edit"
                  >
                    <Button variant="default">
                      <Pencil1Icon />
                    </Button>
                  </TooltipLink>
                );
              },
            },
          ] as ColumnDef<Product>[]
        }
        isLoading={false}
      />
    </div>
  );
}
